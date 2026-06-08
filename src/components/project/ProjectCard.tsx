/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Clock, CheckSquare, User } from "lucide-react";
import Badge from "@/components/ui/Badge";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
	project: {
		id: string;
		name: string;
		description: string | null;
		deadline: string;
		status: "ACTIVE" | "COMPLETED" | "ON_HOLD" | string;
		members?: any[];
		tasks?: any[];
	};
	onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
	const getDaysLeft = (deadlineStr: string) => {
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		const deadline = new Date(deadlineStr);
		deadline.setHours(0, 0, 0, 0);

		const diffTime = deadline.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	const totalTasks = project.tasks?.length || 0;
	const completedTasks =
		project.tasks?.filter((t: any) => t.status === "COMPLETED").length || 0;
	const progress =
		totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

	const daysLeft = getDaysLeft(project.deadline);
	const isOverdue = daysLeft < 0 && project.status !== "COMPLETED";

	return (
		<div className={styles.card} onClick={onClick}>
			<div className={styles.cardHeader}>
				<Badge value={project.status} />

				{isOverdue ? (
					<Badge
						value="Overdue"
						variant="status"
						style={{
							backgroundColor: "var(--danger-light)",
							color: "var(--danger)",
						}}
					/>
				) : daysLeft === 0 && project.status !== "COMPLETED" ? (
					<Badge
						value="Due Today"
						variant="status"
						style={{
							backgroundColor: "var(--warning-light)",
							color: "var(--warning)",
						}}
					/>
				) : null}
			</div>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "0.25rem",
				}}
			>
				<h3 className={styles.cardTitle}>{project.name}</h3>
				<p className={styles.cardDesc}>
					{project.description || "No description provided."}
				</p>
			</div>

			<div className={styles.progressSection}>
				<div className={styles.progressLabelRow}>
					<span>Progress</span>
					<span>{progress}%</span>
				</div>
				<div className={styles.progressBarTrack}>
					<div
						className={styles.progressBarFill}
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>

			<div className={styles.cardFooter}>
				<div className={styles.footerInfo}>
					<Clock size={14} />
					{project.status === "COMPLETED" ? (
						<span>Completed</span>
					) : isOverdue ? (
						<span className={styles.overdueText}>
							{Math.abs(daysLeft)} days overdue
						</span>
					) : (
						<span>{daysLeft} days left</span>
					)}
				</div>
				<div className={styles.footerInfo}>
					<CheckSquare size={14} />
					<span>
						{completedTasks}/{totalTasks} Tasks
					</span>
				</div>
				<div className={styles.footerInfo}>
					<User size={14} />
					<span>{project.members?.length || 0} Members</span>
				</div>
			</div>
		</div>
	);
}
