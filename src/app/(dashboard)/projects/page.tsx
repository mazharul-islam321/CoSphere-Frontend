"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector } from "../../../redux/store";
import { selectCurrentUser } from "../../../redux/features/authSlice";
import { useGetProjectsQuery } from "../../../redux/api/projectsApi";
import ProjectToolbar from "@/components/project/ProjectToolbar";
import ProjectGrid from "@/components/project/ProjectGrid";
import CreateProjectModal from "@/components/project/CreateProjectModal";
import Pagination from "@/components/ui/Pagination";
import styles from "./projects.module.css";

export default function Projects() {
	const user = useAppSelector(selectCurrentUser);

	// Pagination & Filter States
	const [page, setPage] = useState(1);
	const [limit] = useState(6); // 6 items per page fits beautifully in grid layouts
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("ALL");
	const [sortOption, setSortOption] = useState("latest");

	// Reset page when filters change
	useEffect(() => {
		setPage(1);
	}, [search, statusFilter, sortOption]);

	// Modal State
	const [showModal, setShowModal] = useState(false);

	const {
		data: projectsData = { meta: { page: 1, limit: 6, total: 0 }, data: [] },
		isLoading: loading,
		error,
	} = useGetProjectsQuery({
		page,
		limit,
		search,
		status: statusFilter,
		sortBy: sortOption === "latest" ? "createdAt" : "deadline",
		sortOrder: sortOption === "latest" ? "desc" : "asc",
	});

	const projects = projectsData.data || [];
	const meta = projectsData.meta || { page: 1, limit: 6, total: 0 };
	const filteredProjects = projects;

	const canCreate =
		user && (user.role === "ADMIN" || user.role === "PROJECT_MANAGER");

	return (
		<div className={styles.container}>
			<ProjectToolbar
				search={search}
				setSearch={setSearch}
				statusFilter={statusFilter}
				setStatusFilter={setStatusFilter}
				sortOption={sortOption}
				setSortOption={setSortOption}
				canCreate={canCreate}
				onCreateClick={() => setShowModal(true)}
			/>

			<ProjectGrid
				filteredProjects={filteredProjects}
				loading={loading}
				error={error}
			/>

			{meta.total > limit && (
				<Pagination
					currentPage={page}
					limit={limit}
					total={meta.total}
					onPageChange={setPage}
				/>
			)}

			<CreateProjectModal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				projects={projects}
			/>
		</div>
	);
}
