/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { useCreateProjectMutation } from "@/redux/api/projectsApi";
import styles from "./CreateProjectModal.module.css";

interface CreateProjectModalProps {
	isOpen: boolean;
	onClose: () => void;
	projects: any[];
}

export default function CreateProjectModal({
	isOpen,
	onClose,
	projects,
}: CreateProjectModalProps) {
	const [createProject] = useCreateProjectMutation();

	// Modal Form States
	const [modalName, setModalName] = useState("");
	const [modalDesc, setModalDesc] = useState("");
	const [modalDeadline, setModalDeadline] = useState("");
	const [modalError, setModalError] = useState<string | null>(null);
	const [modalSubmitting, setModalSubmitting] = useState(false);

	const handleCreateProject = async (e: React.FormEvent) => {
		e.preventDefault();
		setModalError(null);

		if (!modalName || !modalDeadline) {
			setModalError("Project Name and Deadline are required.");
			return;
		}

		const parsedDeadline = new Date(modalDeadline);
		if (isNaN(parsedDeadline.getTime())) {
			setModalError("Please select a valid deadline.");
			return;
		}

		const today = new Date();
		today.setHours(0, 0, 0, 0);
		if (parsedDeadline < today) {
			setModalError("Please select a valid deadline.");
			return;
		}

		const isDuplicate = projects.some(
			(proj: any) =>
				proj.name.trim().toLowerCase() ===
				modalName.trim().toLowerCase(),
		);
		if (isDuplicate) {
			setModalError("A project with this name already exists.");
			return;
		}

		setModalSubmitting(true);
		try {
			await createProject({
				name: modalName,
				description: modalDesc,
				deadline: modalDeadline,
			}).unwrap();

			// Close Modal & Reset Form
			handleClose();
		} catch (err: any) {
			setModalError(
				err?.data?.message ||
					err.message ||
					"Failed to create project.",
			);
		} finally {
			setModalSubmitting(false);
		}
	};

	const handleClose = () => {
		setModalName("");
		setModalDesc("");
		setModalDeadline("");
		setModalError(null);
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title="New Project"
			maxWidth={500}
		>
			{modalError && (
				<div
					className={styles.errorMsg}
					style={{
						padding: "0.5rem 0.75rem",
						backgroundColor: "var(--danger-light)",
						color: "var(--danger)",
						borderRadius: "var(--radius-sm)",
						fontSize: "0.85rem",
						marginBottom: "1rem",
					}}
				>
					{modalError}
				</div>
			)}

			<form onSubmit={handleCreateProject} className={styles.form}>
				<div className={styles.inputGroup}>
					<label className={styles.label}>Project Name</label>
					<input
						type="text"
						className={styles.input}
						placeholder="e.g. Website Redesign"
						value={modalName}
						onChange={(e) => setModalName(e.target.value)}
						disabled={modalSubmitting}
						required
					/>
				</div>

				<div className={styles.inputGroup}>
					<label className={styles.label}>Description</label>
					<textarea
						className={styles.textarea}
						placeholder="Describe the objectives and scope of the project..."
						value={modalDesc}
						onChange={(e) => setModalDesc(e.target.value)}
						disabled={modalSubmitting}
					/>
				</div>

				<div className={styles.inputGroup}>
					<label className={styles.label}>Deadline</label>
					<input
						type="date"
						className={styles.input}
						value={modalDeadline}
						onChange={(e) => setModalDeadline(e.target.value)}
						disabled={modalSubmitting}
						required
					/>
				</div>

				<div className={styles.modalActions}>
					<button
						type="button"
						className={styles.cancelBtn}
						onClick={handleClose}
						disabled={modalSubmitting}
					>
						Cancel
					</button>
					<button
						type="submit"
						className={styles.saveBtn}
						disabled={modalSubmitting}
					>
						{modalSubmitting ? "Creating..." : "Create Project"}
					</button>
				</div>
			</form>
		</Modal>
	);
}
