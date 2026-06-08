/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Trash2, ArrowRight } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import TaskAttachments from "@/components/task/TaskAttachments";
import TaskComments from "@/components/task/TaskComments";
import {
	useUpdateTaskMutation,
	useDeleteTaskMutation,
} from "@/redux/api/tasksApi";
import styles from "./TaskDetailsModal.module.css";

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

interface TaskDetailsModalProps {
	isOpen: boolean;
	onClose: () => void;
	task: Task | null;
	projectMembers: UserSelect[];
	canEdit: boolean;
	isCollaborator: boolean;
	currentUser: { id: string; name: string; role: string } | null;
}

export default function TaskDetailsModal({
	isOpen,
	onClose,
	task,
	projectMembers = [],
	canEdit,
	isCollaborator,
	currentUser,
}: TaskDetailsModalProps) {
	const [updateTask] = useUpdateTaskMutation();
	const [deleteTask] = useDeleteTaskMutation();

	if (!task) return null;

	const formatDate = (isoString: string) => {
		return new Date(isoString).toLocaleDateString([], {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const handleReassignTask = async (memberId: string | null) => {
		if (task.status === "COMPLETED") {
			if (
				!confirm(
					"This task is already completed. Are you sure you want to reassign it?",
				)
			) {
				return;
			}
		}

		try {
			await updateTask({
				id: task.id,
				assignedMemberId: memberId || null,
			}).unwrap();
		} catch (err: any) {
			alert(
				err?.data?.message || err.message || "Failed to reassign task.",
			);
		}
	};

	const handleUpdateTaskStatus = async (
		newStatus: "TODO" | "IN_PROGRESS" | "COMPLETED",
	) => {
		try {
			await updateTask({ id: task.id, status: newStatus }).unwrap();
		} catch (err: any) {
			alert(
				err?.data?.message ||
					err.message ||
					"Failed to update task status.",
			);
		}
	};

	const handleDeleteTask = async () => {
		if (!confirm("Are you sure you want to delete this task?")) {
			return;
		}

		try {
			await deleteTask(task.id).unwrap();
			onClose();
		} catch (err: any) {
			alert(
				err?.data?.message || err.message || "Failed to delete task.",
			);
		}
	};

	// Check if current user is assignee
	const isAssignee = currentUser && task.assignedMemberId === currentUser.id;
	const canMoveStatus = canEdit || isAssignee;

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="" // Title is rendered custom below inside modal content
			maxWidth={768}
		>
			<div className={styles.taskDetailsModal}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "0.75rem",
					}}
				>
					<Badge value={task.priority} variant="priority" />
					<Badge value={task.status} />
				</div>

				<h2
					style={{
						fontSize: "1.5rem",
						fontWeight: 800,
						marginTop: "0.25rem",
						color: "var(--text-primary)",
					}}
				>
					{task.title}
				</h2>

				<p
					style={{
						color: "var(--text-secondary)",
						fontSize: "0.9rem",
						lineHeight: "1.5",
					}}
				>
					{task.description || "No description provided."}
				</p>

				{/* Meta Grid */}
				<div className={styles.taskDetailMetaGrid}>
					<div style={{ display: "flex", alignItems: "center" }}>
						<span className={styles.metaLabel}>Assignee:</span>
						{canEdit ? (
							<select
								className={styles.select}
								style={{
									display: "inline-block",
									width: "auto",
									padding: "0.35rem 1.75rem 0.35rem 0.75rem",
									fontSize: "0.8rem",
									height: "auto",
									marginLeft: "0.75rem",
									cursor: "pointer",
								}}
								value={task.assignedMemberId || ""}
								onChange={(e) =>
									handleReassignTask(e.target.value || null)
								}
							>
								<option value="">Unassigned</option>
								{projectMembers.map((m) => (
									<option key={m.id} value={m.id}>
										{m.name}
									</option>
								))}
							</select>
						) : (
							<span
								className={styles.metaVal}
								style={{ marginLeft: "0.5rem" }}
							>
								{task.assignedMember?.name || "Unassigned"}
							</span>
						)}
					</div>

					<div>
						<span className={styles.metaLabel}>Due Date: </span>
						<span className={styles.metaVal}>
							{formatDate(task.dueDate)}
						</span>
					</div>

					<div style={{ gridColumn: "span 2" }}>
						<span className={styles.metaLabel}>Move Status: </span>
						{canMoveStatus ? (
							<div
								style={{
									display: "inline-flex",
									gap: "0.5rem",
									marginLeft: "0.5rem",
								}}
							>
								{task.status !== "TODO" && (
									<button
										onClick={() =>
											handleUpdateTaskStatus(
												task.status === "COMPLETED"
													? "IN_PROGRESS"
													: "TODO",
											)
										}
										className={styles.editBtn}
										style={{
											padding: "0.2rem 0.5rem",
											fontSize: "0.75rem",
										}}
									>
										Move Back
									</button>
								)}
								{task.status !== "COMPLETED" && (
									<button
										onClick={() =>
											handleUpdateTaskStatus(
												task.status === "TODO"
													? "IN_PROGRESS"
													: "COMPLETED",
											)
										}
										className={styles.editBtn}
										style={{
											padding: "0.2rem 0.5rem",
											fontSize: "0.75rem",
											color: "var(--success)",
											borderColor: "var(--success)",
										}}
									>
										Advance Status{" "}
										<ArrowRight
											size={12}
											style={{
												display: "inline",
												marginLeft: "0.15rem",
											}}
										/>
									</button>
								)}
							</div>
						) : (
							<span
								className={styles.metaVal}
								style={{
									fontStyle: "italic",
									fontSize: "0.8rem",
									color: "var(--text-tertiary)",
								}}
							>
								Only assignees or managers can update status.
							</span>
						)}
					</div>
				</div>

				{/* Attachments Section */}
				<TaskAttachments
					taskId={task.id}
					attachments={task.attachments}
					isCollaborator={!!isCollaborator}
				/>

				{/* Comments Section */}
				<TaskComments
					taskId={task.id}
					comments={task.comments}
					isCollaborator={!!isCollaborator}
				/>

				<div
					className={styles.modalActions}
					style={{
						borderTop: "1px solid var(--border-color)",
						paddingTop: "1.25rem",
						marginTop: "0.5rem",
					}}
				>
					{canEdit && (
						<button
							onClick={handleDeleteTask}
							className={styles.deleteBtn}
							style={{ marginRight: "auto" }}
						>
							<Trash2 size={14} />
							<span>Delete Task</span>
						</button>
					)}
					<button onClick={onClose} className={styles.cancelBtn}>
						Close
					</button>
				</div>
			</div>
		</Modal>
	);
}
