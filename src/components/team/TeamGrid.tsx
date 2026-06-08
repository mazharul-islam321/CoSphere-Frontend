/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Mail } from "lucide-react";
import styles from "./TeamGrid.module.css";

export interface MemberWorkload {
	id: string;
	name: string;
	email: string;
	role: string;
	totalTasks: number;
	completedTasks: number;
	pendingTasks: number;
}

interface TeamGridProps {
	filteredWorkloads: MemberWorkload[];
	loading: boolean;
	error: any;
}

export default function TeamGrid({
	filteredWorkloads,
	loading,
	error,
}: TeamGridProps) {
	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n: string) => n[0])
			.slice(0, 2)
			.join("")
			.toUpperCase();
	};

	if (loading) {
		return (
			<div className={styles.grid}>
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className={`${styles.memberCard} shimmer`}
						style={{ height: "220px" }}
					/>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div
				style={{
					textAlign: "center",
					color: "var(--danger)",
					padding: "2rem",
				}}
			>
				<p>An error occurred while loading team workload statistics.</p>
			</div>
		);
	}

	if (filteredWorkloads.length === 0) {
		return (
			<div
				style={{
					textAlign: "center",
					color: "var(--text-secondary)",
					padding: "4rem 2rem",
				}}
			>
				<p>No team members found matching the criteria.</p>
			</div>
		);
	}

	return (
		<div className={styles.grid}>
			{filteredWorkloads.map((member) => {
				const progress =
					member.totalTasks > 0
						? Math.round(
								(member.completedTasks / member.totalTasks) *
									100,
							)
						: 0;

				return (
					<div key={member.id} className={styles.memberCard}>
						<div className={styles.header}>
							<div className={styles.avatar}>
								{getInitials(member.name)}
							</div>
							<div className={styles.info}>
								<h3 className={styles.name}>{member.name}</h3>
								<span className={styles.role}>
									{member.role === "PROJECT_MANAGER"
										? "Project Manager"
										: "Team Member"}
								</span>
								<span className={styles.email}>
									<Mail
										size={12}
										style={{
											display: "inline",
											marginRight: "0.25rem",
											verticalAlign: "middle",
										}}
									/>
									{member.email}
								</span>
							</div>
						</div>

						<div className={styles.metricsGrid}>
							<div>
								<div className={styles.metricValue}>
									{member.totalTasks}
								</div>
								<div className={styles.metricLabel}>
									Assigned
								</div>
							</div>
							<div>
								<div
									className={styles.metricValue}
									style={{ color: "var(--success)" }}
								>
									{member.completedTasks}
								</div>
								<div className={styles.metricLabel}>
									Completed
								</div>
							</div>
							<div>
								<div
									className={styles.metricValue}
									style={{
										color:
											member.pendingTasks > 3
												? "var(--danger)"
												: "var(--text-primary)",
									}}
								>
									{member.pendingTasks}
								</div>
								<div className={styles.metricLabel}>
									Pending
								</div>
							</div>
						</div>

						<div className={styles.progressWrapper}>
							<div className={styles.progressLabel}>
								<span>Task Completion</span>
								<span>{progress}%</span>
							</div>
							<div className={styles.track}>
								<div
									className={styles.fill}
									style={{
										width: `${progress}%`,
										backgroundColor:
											progress === 100
												? "var(--success)"
												: "var(--primary)",
									}}
								/>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
