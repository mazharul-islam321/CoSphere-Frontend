/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useRouter } from "next/navigation";
import ProjectCard from "@/components/project/ProjectCard";
import styles from "./ProjectGrid.module.css";

interface ProjectGridProps {
	filteredProjects: any[];
	loading: boolean;
	error: any;
}

export default function ProjectGrid({
	filteredProjects,
	loading,
	error,
}: ProjectGridProps) {
	const router = useRouter();

	if (loading) {
		return (
			<div className={styles.grid}>
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className={`${styles.card} shimmer`}
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
				<p>An error occurred while loading projects.</p>
			</div>
		);
	}

	if (filteredProjects.length === 0) {
		return (
			<div
				style={{
					textAlign: "center",
					color: "var(--text-secondary)",
					padding: "4rem 2rem",
				}}
			>
				<p>No projects found matching the criteria.</p>
			</div>
		);
	}

	return (
		<div className={styles.grid}>
			{filteredProjects.map((proj: any) => (
				<ProjectCard
					key={proj.id}
					project={proj}
					onClick={() => router.push(`/projects/${proj.id}`)}
				/>
			))}
		</div>
	);
}
