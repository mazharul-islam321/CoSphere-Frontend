/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { useAddMemberToProjectMutation } from "@/redux/api/projectsApi";
import styles from "./AddMemberModal.module.css";

interface UserSelect {
	id: string;
	name: string;
	email: string;
	role: string;
}

interface AddMemberModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectId: string;
	nonMembers: UserSelect[];
}

export default function AddMemberModal({
	isOpen,
	onClose,
	projectId,
	nonMembers,
}: AddMemberModalProps) {
	const [addMember, { isLoading: memberSubmitting }] =
		useAddMemberToProjectMutation();
	const [selectedMemberId, setSelectedMemberId] = useState("");
	const [memberError, setMemberError] = useState<string | null>(null);

	const handleAddMember = async (e: React.FormEvent) => {
		e.preventDefault();
		setMemberError(null);
		if (!selectedMemberId) {
			setMemberError("Please select a member.");
			return;
		}

		try {
			await addMember({
				id: projectId,
				memberId: selectedMemberId,
			}).unwrap();
			setSelectedMemberId("");
			onClose();
		} catch (err: any) {
			setMemberError(
				err?.data?.message || err.message || "Failed to add member.",
			);
		}
	};

	const handleClose = () => {
		setSelectedMemberId("");
		setMemberError(null);
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title="Add Team Member"
			maxWidth={500}
		>
			{memberError && (
				<div className={styles.errorMsg}>{memberError}</div>
			)}

			<form onSubmit={handleAddMember} className={styles.form}>
				<div className={styles.inputGroup}>
					<label className={styles.label}>Select Member</label>
					{nonMembers.length === 0 ? (
						<p
							style={{
								fontSize: "0.85rem",
								color: "var(--text-secondary)",
							}}
						>
							All users are already members of this project.
						</p>
					) : (
						<select
							className={styles.select}
							value={selectedMemberId}
							onChange={(e) =>
								setSelectedMemberId(e.target.value)
							}
							disabled={memberSubmitting}
							required
						>
							<option value="">-- Choose User --</option>
							{nonMembers.map((u: UserSelect) => (
								<option key={u.id} value={u.id}>
									{u.name} ({u.email})
								</option>
							))}
						</select>
					)}
				</div>

				<div className={styles.modalActions}>
					<button
						type="button"
						className={styles.cancelBtn}
						onClick={handleClose}
						disabled={memberSubmitting}
					>
						Cancel
					</button>
					{nonMembers.length > 0 && (
						<button
							type="submit"
							className={styles.saveBtn}
							disabled={memberSubmitting}
						>
							{memberSubmitting ? "Adding..." : "Add Member"}
						</button>
					)}
				</div>
			</form>
		</Modal>
	);
}
