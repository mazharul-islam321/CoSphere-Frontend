import React from "react";
import styles from "./BulkActionBar.module.css";

interface BulkActionBarProps {
	selectedCount: number;
	onBulkStatusUpdate: (status: string) => void;
	onBulkDelete: () => void;
}

export default function BulkActionBar({
	selectedCount,
	onBulkStatusUpdate,
	onBulkDelete,
}: BulkActionBarProps) {
	return (
		<div className={styles.bulkActionBar}>
			<span>{selectedCount} tasks selected</span>
			<div className={styles.bulkActionsGroup}>
				<select
					className={styles.bulkSelect}
					value=""
					onChange={(e) => onBulkStatusUpdate(e.target.value)}
				>
					<option value="" disabled>
						Update Status...
					</option>
					<option value="TODO">To Do</option>
					<option value="IN_PROGRESS">In Progress</option>
					<option value="COMPLETED">Completed</option>
				</select>
				<button
					onClick={onBulkDelete}
					className={styles.bulkDeleteBtn}
				>
					Delete Selected
				</button>
			</div>
		</div>
	);
}
