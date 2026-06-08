/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { useCreateTaskMutation } from "@/redux/api/tasksApi";
import styles from "./AddTaskModal.module.css";

interface UserSelect {
	id: string;
	name: string;
	email?: string;
	role?: string;
}

interface AddTaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectId: string;
	projectTasks: any[];
	projectMembers: UserSelect[];
}

export default function AddTaskModal({
	isOpen,
	onClose,
	projectId,
	projectTasks,
	projectMembers,
}: AddTaskModalProps) {
	const [createTask, { isLoading: taskSubmitting }] = useCreateTaskMutation();

	const [taskTitle, setTaskTitle] = useState("");
	const [taskDesc, setTaskDesc] = useState("");
	const [taskDueDate, setTaskDueDate] = useState("");
	const [taskPriority, setTaskPriority] = useState<"HIGH" | "MEDIUM" | "LOW">(
		"MEDIUM",
	);
	const [taskAssigneeId, setTaskAssigneeId] = useState("");
	const [taskError, setTaskError] = useState<string | null>(null);

	const handleAddTask = async (e: React.FormEvent) => {
		e.preventDefault();
		setTaskError(null);

		if (!taskTitle || !taskDueDate) {
			setTaskError("Task Title and Due Date are required.");
			return;
		}

		const parsedDueDate = new Date(taskDueDate);
		if (isNaN(parsedDueDate.getTime())) {
			setTaskError("Please select a valid deadline.");
			return;
		}

		const today = new Date();
		today.setHours(0, 0, 0, 0);
		if (parsedDueDate < today) {
			setTaskError("Please select a valid deadline.");
			return;
		}

		const isDuplicate = projectTasks?.some(
			(t: any) =>
				t.title.trim().toLowerCase() === taskTitle.trim().toLowerCase(),
		);
		if (isDuplicate) {
			setTaskError("This task already exists in the project.");
			return;
		}

		try {
			await createTask({
				title: taskTitle,
				description: taskDesc,
				dueDate: taskDueDate,
				priority: taskPriority,
				assignedMemberId: taskAssigneeId || null,
				projectId,
			}).unwrap();

			handleClose();
		} catch (err: any) {
			setTaskError(
				err?.data?.message || err.message || "Failed to create task.",
			);
		}
	};

	const handleClose = () => {
		setTaskTitle("");
		setTaskDesc("");
		setTaskDueDate("");
		setTaskPriority("MEDIUM");
		setTaskAssigneeId("");
		setTaskError(null);
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title="New Task"
			maxWidth={500}
		>
			{taskError && <div className={styles.errorMsg}>{taskError}</div>}

			<form onSubmit={handleAddTask} className={styles.form}>
				<div className={styles.inputGroup}>
					<label className={styles.label}>Task Title</label>
					<input
						type="text"
						className={styles.input}
						placeholder="e.g. Code API routes"
						value={taskTitle}
						onChange={(e) => setTaskTitle(e.target.value)}
						disabled={taskSubmitting}
						required
					/>
				</div>

				<div className={styles.inputGroup}>
					<label className={styles.label}>Description</label>
					<textarea
						className={styles.textarea}
						placeholder="Describe the task instructions..."
						value={taskDesc}
						onChange={(e) => setTaskDesc(e.target.value)}
						disabled={taskSubmitting}
					/>
				</div>

				<div className={styles.inputGroup}>
					<label className={styles.label}>Due Date</label>
					<input
						type="date"
						className={styles.input}
						value={taskDueDate}
						onChange={(e) => setTaskDueDate(e.target.value)}
						disabled={taskSubmitting}
						required
					/>
				</div>

				<div className={styles.inputGroup}>
					<label className={styles.label}>Priority</label>
					<select
						className={styles.select}
						value={taskPriority}
						onChange={(e) => setTaskPriority(e.target.value as any)}
						disabled={taskSubmitting}
					>
						<option value="LOW">LOW</option>
						<option value="MEDIUM">MEDIUM</option>
						<option value="HIGH">HIGH</option>
					</select>
				</div>

				<div className={styles.inputGroup}>
					<label className={styles.label}>Assigned Member</label>
					<select
						className={styles.select}
						value={taskAssigneeId}
						onChange={(e) => setTaskAssigneeId(e.target.value)}
						disabled={taskSubmitting}
					>
						<option value="">-- Unassigned --</option>
						{(projectMembers || []).map((m: UserSelect) => (
							<option key={m.id} value={m.id}>
								{m.name}
							</option>
						))}
					</select>
				</div>

				<div className={styles.modalActions}>
					<button
						type="button"
						className={styles.cancelBtn}
						onClick={handleClose}
						disabled={taskSubmitting}
					>
						Cancel
					</button>
					<button
						type="submit"
						className={styles.saveBtn}
						disabled={taskSubmitting}
					>
						{taskSubmitting ? "Creating..." : "Create Task"}
					</button>
				</div>
			</form>
		</Modal>
	);
}
