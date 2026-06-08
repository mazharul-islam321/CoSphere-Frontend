/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown, Calendar, AlertCircle } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import styles from "./TasksTable.module.css";

export interface Task {
	id: string;
	title: string;
	description: string | null;
	dueDate: string;
	priority: "HIGH" | "MEDIUM" | "LOW" | string;
	status: "TODO" | "IN_PROGRESS" | "COMPLETED" | string;
	projectId: string;
	project: { id: string; name: string };
	assignedMember: { id: string; name: string } | null;
	createdAt: string;
}

interface TasksTableProps {
	filteredTasks: Task[];
	selectedIds: string[];
	setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
	sortField: "dueDate" | "createdAt" | "priority";
	sortOrder: "asc" | "desc";
	toggleSort: (field: "dueDate" | "createdAt" | "priority") => void;
}

export default function TasksTable({
	filteredTasks,
	selectedIds,
	setSelectedIds,
	toggleSort,
}: TasksTableProps) {
	const router = useRouter();

	const getDaysLeft = (deadlineStr: string) => {
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		const deadline = new Date(deadlineStr);
		deadline.setHours(0, 0, 0, 0);
		return Math.ceil(
			(deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
		);
	};

	const formatDate = (isoString: string) => {
		return new Date(isoString).toLocaleDateString([], {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	return (
		<div className={styles.tasksTableContainer}>
			<table className={styles.table}>
				<thead>
					<tr>
						<th
							className={styles.th}
							style={{
								width: "40px",
								textAlign: "center",
							}}
						>
							<input
								type="checkbox"
								className={styles.checkbox}
								checked={
									filteredTasks.length > 0 &&
									selectedIds.length === filteredTasks.length
								}
								onChange={(e) => {
									if (e.target.checked) {
										setSelectedIds(
											filteredTasks.map((t) => t.id),
										);
									} else {
										setSelectedIds([]);
									}
								}}
							/>
						</th>
						<th className={styles.th}>Task Title</th>
						<th className={styles.th}>Project</th>
						<th
							className={styles.thSortable}
							onClick={() => toggleSort("priority")}
						>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "0.25rem",
								}}
							>
								<span>Priority</span>
								<ArrowUpDown size={12} />
							</div>
						</th>
						<th
							className={styles.thSortable}
							onClick={() => toggleSort("dueDate")}
						>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "0.25rem",
								}}
							>
								<span>Due Date</span>
								<ArrowUpDown size={12} />
							</div>
						</th>
						<th className={styles.th}>Status</th>
						<th className={styles.th}>Assignee</th>
					</tr>
				</thead>
				<tbody>
					{filteredTasks.map((task: any) => {
						const daysLeft = getDaysLeft(task.dueDate);
						const isOverdue =
							daysLeft < 0 && task.status !== "COMPLETED";

						return (
							<tr key={task.id} className={styles.tr}>
								<td
									className={styles.td}
									style={{
										width: "40px",
										textAlign: "center",
									}}
								>
									<input
										type="checkbox"
										className={styles.checkbox}
										checked={selectedIds.includes(task.id)}
										onChange={(e) => {
											if (e.target.checked) {
												setSelectedIds([
													...selectedIds,
													task.id,
												]);
											} else {
												setSelectedIds(
													selectedIds.filter(
														(id) => id !== task.id,
													),
												);
											}
										}}
									/>
								</td>
								<td className={styles.td}>
									<div
										className={styles.taskTitle}
										onClick={() =>
											router.push(
												`/projects/${task.project?.id || task.projectId}`,
											)
										}
									>
										{task.title}
									</div>
								</td>
								<td className={styles.td}>
									<span className={styles.projectName}>
										{task.project?.name ||
											"Unknown Project"}
									</span>
								</td>
								<td className={styles.td}>
									<Badge
										value={task.priority}
										variant="priority"
									/>
								</td>
								<td className={styles.td}>
									<span
										style={{
											display: "flex",
											alignItems: "center",
											gap: "0.35rem",
											color: isOverdue
												? "var(--danger)"
												: "var(--text-primary)",
											fontWeight: isOverdue
												? "700"
												: "normal",
										}}
									>
										<Calendar size={14} />
										<span>{formatDate(task.dueDate)}</span>
										{isOverdue && (
											<span title="Overdue!">
												<AlertCircle size={14} />
											</span>
										)}
									</span>
								</td>
								<td className={styles.td}>
									<Badge value={task.status} />
								</td>
								<td className={styles.td}>
									{task.assignedMember ? (
										<div className={styles.avatarRow}>
											<Avatar
												name={task.assignedMember.name}
												size={24}
											/>
											<span
												style={{
													fontWeight: 600,
													fontSize: "0.85rem",
													marginLeft: "0.5rem",
												}}
											>
												{task.assignedMember.name}
											</span>
										</div>
									) : (
										<span
											style={{
												fontStyle: "italic",
												color: "var(--text-tertiary)",
											}}
										>
											Unassigned
										</span>
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
