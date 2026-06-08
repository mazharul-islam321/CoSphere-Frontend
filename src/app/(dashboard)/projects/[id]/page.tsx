/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "../../../../redux/store";
import { selectCurrentUser } from "../../../../redux/features/authSlice";
import {
	useGetProjectByIdQuery,
	useDeleteProjectMutation,
	useRemoveMemberFromProjectMutation,
} from "../../../../redux/api/projectsApi";
import { useGetUsersQuery } from "../../../../redux/api/authApi";
import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectMembersPanel from "@/components/project/ProjectMembersPanel";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import TaskDetailsModal from "@/components/task/TaskDetailsModal";
import EditProjectModal from "@/components/project/EditProjectModal";
import AddMemberModal from "@/components/project/AddMemberModal";
import AddTaskModal from "@/components/task/AddTaskModal";
import styles from "./projectDetail.module.css";

interface UserSelect {
	id: string;
	name: string;
	email: string;
	role: string;
}

interface Comment {
	id: string;
	content: string;
	createdAt: string;
	author: { id: string; name: string };
}

interface Attachment {
	id: string;
	fileName: string;
	fileUrl: string;
	createdAt: string;
}

interface Task {
	id: string;
	title: string;
	description: string | null;
	dueDate: string;
	priority: "HIGH" | "MEDIUM" | "LOW" | string;
	status: "TODO" | "IN_PROGRESS" | "COMPLETED" | string;
	assignedMemberId: string | null;
	assignedMember: { id: string; name: string } | null;
	comments: Comment[];
	attachments: Attachment[];
}

export default function ProjectDetail() {
	const { id } = useParams();
	const user = useAppSelector(selectCurrentUser);
	const router = useRouter();

	const {
		data: project,
		isLoading: loading,
		isFetching,
		error,
	} = useGetProjectByIdQuery(id as string, { skip: !id });
	const { data: allUsers = [] } = useGetUsersQuery();

	const [deleteProject] = useDeleteProjectMutation();
	const [removeMember] = useRemoveMemberFromProjectMutation();

	// Project Edit Modal State
	const [showEditProjModal, setShowEditProjModal] = useState(false);

	// Add Member Modal State
	const [showAddMemberModal, setShowAddMemberModal] = useState(false);

	// Task Create Modal State
	const [showAddTaskModal, setShowAddTaskModal] = useState(false);

	// Task Details Modal State (Using derived task reference instead of duplicating object)
	const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
	const selectedTask =
		project?.tasks?.find((t: Task) => t.id === selectedTaskId) || null;

	const handleDeleteProject = async () => {
		if (
			!confirm(
				"Are you sure you want to delete this project? All associated tasks will be permanently removed.",
			)
		) {
			return;
		}

		try {
			await deleteProject(id as string).unwrap();
			router.replace("/projects");
		} catch (err: any) {
			alert(
				err?.data?.message ||
					err.message ||
					"Failed to delete project.",
			);
		}
	};

	const handleRemoveMember = async (memberId: string) => {
		if (
			!confirm(
				"Remove this member from the project? They will remain registered in the system.",
			)
		) {
			return;
		}

		try {
			await removeMember({ id: id as string, memberId }).unwrap();
		} catch (err: any) {
			alert(
				err?.data?.message || err.message || "Failed to remove member.",
			);
		}
	};

	if (loading || (isFetching && !project)) {
		return (
			<div className={styles.container}>
				<div
					className={`${styles.projectHeaderCard} shimmer`}
					style={{ height: "180px" }}
				/>
				<div className={styles.splitLayout}>
					<div
						className={`${styles.kanbanBoard} shimmer`}
						style={{ height: "400px" }}
					/>
					<div
						className={`${styles.membersPanel} shimmer`}
						style={{ height: "300px" }}
					/>
				</div>
			</div>
		);
	}

	if (error || !project) {
		return (
			<div
				style={{
					padding: "2rem",
					textAlign: "center",
					color: "var(--danger)",
				}}
			>
				<p>An error occurred while loading project details.</p>
				<button
					onClick={() => router.push("/projects")}
					className={styles.editBtn}
					style={{ margin: "1rem auto" }}
				>
					Back to Projects
				</button>
			</div>
		);
	}

	// Role Checks
	const isAdmin = user?.role === "ADMIN";
	const isCreator = project.creatorId === user?.id;
	const isPM = user?.role === "PROJECT_MANAGER";
	const isCollaborator =
		(project.members || []).some((m: UserSelect) => m.id === user?.id) ||
		isCreator ||
		isAdmin;
	const canEdit = isAdmin || isCreator || isPM;

	// Users not currently added to project
	const nonMembers = allUsers.filter(
		(u: UserSelect) =>
			u.role !== "ADMIN" &&
			!(project.members || []).some((m: UserSelect) => m.id === u.id) &&
			project.creatorId !== u.id,
	);

	return (
		<div className={styles.container}>
			{/* Project Header Component */}
			<ProjectHeader
				project={project}
				canEdit={canEdit}
				isAdmin={isAdmin}
				isCreator={isCreator}
				onEditClick={() => setShowEditProjModal(true)}
				onDeleteClick={handleDeleteProject}
			/>

			{/* Split Layout: Board + Members Panel */}
			<div className={styles.splitLayout}>
				{/* Kanban Board Component */}
				<div>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: "1rem",
						}}
					>
						<h2 className={styles.boardTitle}>Task Board</h2>
						{canEdit && (
							<button
								onClick={() => setShowAddTaskModal(true)}
								className={styles.editBtn}
								style={{
									color: "var(--primary)",
									borderColor: "var(--primary)",
								}}
							>
								New Task
							</button>
						)}
					</div>

					<KanbanBoard
						tasks={project.tasks}
						onTaskClick={(task) => setSelectedTaskId(task.id)}
					/>
				</div>

				{/* Right Sidebar: Members Panel Component */}
				<ProjectMembersPanel
					project={project}
					canEdit={canEdit}
					onAddMemberClick={() => setShowAddMemberModal(true)}
					onRemoveMemberClick={handleRemoveMember}
				/>
			</div>

			{/* Edit Project Modal Component */}
			<EditProjectModal
				isOpen={showEditProjModal}
				onClose={() => setShowEditProjModal(false)}
				project={project}
			/>

			{/* Add Team Member Modal Component */}
			<AddMemberModal
				isOpen={showAddMemberModal}
				onClose={() => setShowAddMemberModal(false)}
				projectId={id as string}
				nonMembers={nonMembers}
			/>

			{/* Add Task Modal Component */}
			<AddTaskModal
				isOpen={showAddTaskModal}
				onClose={() => setShowAddTaskModal(false)}
				projectId={id as string}
				projectTasks={project.tasks || []}
				projectMembers={project.members || []}
			/>

			{/* Task Details Modal Component */}
			<TaskDetailsModal
				isOpen={!!selectedTaskId}
				onClose={() => setSelectedTaskId(null)}
				task={selectedTask}
				projectMembers={project.members}
				canEdit={canEdit}
				isCollaborator={isCollaborator || selectedTask?.assignedMemberId === user?.id}
				currentUser={user}
			/>
		</div>
	);
}
