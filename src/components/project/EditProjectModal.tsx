/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { useUpdateProjectMutation } from "@/redux/api/projectsApi";
import styles from "./EditProjectModal.module.css";

interface EditProjectModalProps {
	isOpen: boolean;
	onClose: () => void;
	project: any;
}

export default function EditProjectModal({
	isOpen,
	onClose,
	project,
}: EditProjectModalProps) {
	const [updateProject, { isLoading: editProjSubmitting }] =
		useUpdateProjectMutation();

	const [editProjName, setEditProjName] = useState("");
	const [editProjDesc, setEditProjDesc] = useState("");
	const [editProjDeadline, setEditProjDeadline] = useState("");
	const [editProjStatus, setEditProjStatus] = useState<
		"ACTIVE" | "COMPLETED" | "ON_HOLD"
	>("ACTIVE");
	const [editProjError, setEditProjError] = useState<string | null>(null);

	useEffect(() => {
		if (project) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setEditProjName(project.name);
			setEditProjDesc(project.description || "");
			setEditProjDeadline(
				project.deadline
					? new Date(project.deadline).toISOString().split("T")[0]
					: "",
			);
			setEditProjStatus(project.status);
		}
	}, [project]);

	const handleUpdateProject = async (e: React.FormEvent) => {
		e.preventDefault();
		setEditProjError(null);

		if (!editProjName || !editProjDeadline) {
			setEditProjError("Project Name and Deadline are required.");
			return;
		}

		const parsedDeadline = new Date(editProjDeadline);
		if (isNaN(parsedDeadline.getTime())) {
			setEditProjError("Please select a valid deadline.");
			return;
		}

		const today = new Date();
		today.setHours(0, 0, 0, 0);
		if (parsedDeadline < today) {
			setEditProjError("Please select a valid deadline.");
			return;
		}

		try {
			await updateProject({
				id: project.id,
				name: editProjName,
				description: editProjDesc,
				deadline: editProjDeadline,
				status: editProjStatus,
			}).unwrap();
			onClose();
		} catch (err: any) {
			setEditProjError(
				err?.data?.message ||
					err.message ||
					"Failed to update project.",
			);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Edit Project"
			maxWidth={500}
		>
			{editProjError && (
				<div className={styles.errorMsg}>{editProjError}</div>
			)}

			<form onSubmit={handleUpdateProject} className={styles.form}>
				<div className={styles.inputGroup}>
					<label className={styles.label}>Project Name</label>
					<input
						type="text"
						className={styles.input}
						value={editProjName}
						onChange={(e) => setEditProjName(e.target.value)}
						disabled={editProjSubmitting}
						required
					/>
				</div>

				<div className={styles.inputGroup}>
					<label className={styles.label}>Description</label>
					<textarea
						className={styles.textarea}
						value={editProjDesc}
						onChange={(e) => setEditProjDesc(e.target.value)}
						disabled={editProjSubmitting}
					/>
				</div>

				<div className={styles.inputGroup}>
					<label className={styles.label}>Deadline</label>
					<input
						type="date"
						className={styles.input}
						value={editProjDeadline}
						onChange={(e) => setEditProjDeadline(e.target.value)}
						disabled={editProjSubmitting}
						required
					/>
				</div>

				<div className={styles.inputGroup}>
					<label className={styles.label}>Status</label>
					<select
						className={styles.select}
						value={editProjStatus}
						onChange={(e) =>
							setEditProjStatus(e.target.value as any)
						}
						disabled={editProjSubmitting}
					>
						<option value="ACTIVE">ACTIVE</option>
						<option value="COMPLETED">COMPLETED</option>
						<option value="ON_HOLD">ON HOLD</option>
					</select>
				</div>

				<div className={styles.modalActions}>
					<button
						type="button"
						className={styles.cancelBtn}
						onClick={onClose}
						disabled={editProjSubmitting}
					>
						Cancel
					</button>
					<button
						type="submit"
						className={styles.saveBtn}
						disabled={editProjSubmitting}
					>
						{editProjSubmitting ? "Saving..." : "Save Changes"}
					</button>
				</div>
			</form>
		</Modal>
	);
}
