/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
	useGetTasksQuery,
	useUpdateTaskMutation,
	useDeleteTaskMutation,
} from "../../../redux/api/tasksApi";
import { useGetUsersQuery } from "../../../redux/api/authApi";
import TaskFilters from "@/components/task/TaskFilters";
import BulkActionBar from "@/components/task/BulkActionBar";
import TasksTable from "@/components/task/TasksTable";
import Pagination from "@/components/ui/Pagination";
import styles from "./tasks.module.css";

export default function Tasks() {
	// Pagination, Sorting, Search & Filter state
	const [limit, setLimit] = useState(10);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("ALL");
	const [priorityFilter, setPriorityFilter] = useState("ALL");
	const [assigneeFilter, setAssigneeFilter] = useState("ALL");
	const [deadlineFilter, setDeadlineFilter] = useState("ALL");

	// Sort State
	const [sortField, setSortField] = useState<
		"dueDate" | "createdAt" | "priority"
	>("dueDate");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	const {
		data: tasksData = { meta: { page: 1, limit: 10, total: 0 }, data: [] },
		isLoading: loading,
		error,
	} = useGetTasksQuery({
		page: 1, // Always query page 1 with dynamic limit for infinite scroll list stability
		limit,
		search,
		status: statusFilter,
		priority: priorityFilter,
		assignedMemberId: assigneeFilter,
		deadlineFilter,
		sortBy: sortField,
		sortOrder,
	});

	const tasks = tasksData.data || [];
	const meta = tasksData.meta || { page: 1, limit: 10, total: 0 };
	const { data: allUsers = [] } = useGetUsersQuery();
	const [updateTask] = useUpdateTaskMutation();
	const [deleteTask] = useDeleteTaskMutation();

	// Selected tasks for bulk actions
	const [selectedIds, setSelectedIds] = useState<string[]>([]);

	// Prefill search from URL search parameter if present
	React.useEffect(() => {
		if (typeof window !== "undefined") {
			const params = new URLSearchParams(window.location.search);
			const query = params.get("search");
			if (query) {
				// eslint-disable-next-line react-hooks/set-state-in-effect
				setSearch(query);
			}
		}
	}, []);

	// Reset limit when sorting or filters change
	React.useEffect(() => {
		setLimit(10);
	}, [search, statusFilter, priorityFilter, assigneeFilter, deadlineFilter, sortField, sortOrder]);

	// Sentinel ref and observer for scroll-to-load
	const sentinelRef = React.useRef<HTMLDivElement>(null);
	React.useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && tasks.length < meta.total && !loading) {
					setLimit((prev) => prev + 10);
				}
			},
			{ threshold: 0.1 }
		);

		if (sentinelRef.current) {
			observer.observe(sentinelRef.current);
		}

		return () => observer.disconnect();
	}, [tasks.length, meta.total, loading]);

	const handleBulkStatusUpdate = async (status: string) => {
		if (!status || selectedIds.length === 0) return;
		if (
			!confirm(
				`Are you sure you want to update ${selectedIds.length} tasks to "${status}"?`,
			)
		)
			return;

		try {
			await Promise.all(
				selectedIds.map((id) => updateTask({ id, status }).unwrap()),
			);
			setSelectedIds([]);
			alert("Selected tasks updated successfully.");
		} catch (err: any) {
			alert(
				err?.data?.message ||
					err.message ||
					"Failed to update some tasks.",
			);
		}
	};

	const handleBulkDelete = async () => {
		if (selectedIds.length === 0) return;
		if (
			!confirm(
				`Are you sure you want to delete the ${selectedIds.length} selected tasks? This action cannot be undone.`,
			)
		)
			return;

		try {
			await Promise.all(selectedIds.map((id) => deleteTask(id).unwrap()));
			setSelectedIds([]);
			alert("Selected tasks deleted successfully.");
		} catch (err: any) {
			alert(
				err?.data?.message ||
					err.message ||
					"Failed to delete some tasks.",
			);
		}
	};

	const teamMembers = allUsers.filter((u: any) => u.role !== "ADMIN");

	const handleClearFilters = () => {
		setSearch("");
		setStatusFilter("ALL");
		setPriorityFilter("ALL");
		setAssigneeFilter("ALL");
		setDeadlineFilter("ALL");
	};

	const toggleSort = (field: "dueDate" | "createdAt" | "priority") => {
		if (sortField === field) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortOrder("asc");
		}
	};

	const filteredTasks = tasks;

	return (
		<div className={styles.container}>
			{/* Filters Panel */}
			<TaskFilters
				search={search}
				setSearch={setSearch}
				statusFilter={statusFilter}
				setStatusFilter={setStatusFilter}
				priorityFilter={priorityFilter}
				setPriorityFilter={setPriorityFilter}
				assigneeFilter={assigneeFilter}
				setAssigneeFilter={setAssigneeFilter}
				deadlineFilter={deadlineFilter}
				setDeadlineFilter={setDeadlineFilter}
				teamMembers={teamMembers}
				onClearFilters={handleClearFilters}
			/>

			{/* Loading & Error States */}
			{loading ? (
				<div className={styles.loadingContainer}>
					<div
						className="shimmer"
						style={{
							width: "100%",
							height: "100%",
							borderRadius: "var(--radius-md)",
						}}
					/>
				</div>
			) : error ? (
				<div
					style={{
						textAlign: "center",
						color: "var(--danger)",
						padding: "2rem",
					}}
				>
					<p>An error occurred while loading tasks.</p>
				</div>
			) : filteredTasks.length === 0 ? (
				<div
					style={{
						textAlign: "center",
						color: "var(--text-secondary)",
						padding: "4rem 2rem",
					}}
				>
					<p>No tasks found matching the criteria.</p>
				</div>
			) : (
				<>
					{/* Bulk Action Bar */}
					{selectedIds.length > 0 && (
						<BulkActionBar
							selectedCount={selectedIds.length}
							onBulkStatusUpdate={handleBulkStatusUpdate}
							onBulkDelete={handleBulkDelete}
						/>
					)}

					{/* Tasks Table */}
					<TasksTable
						filteredTasks={filteredTasks}
						selectedIds={selectedIds}
						setSelectedIds={setSelectedIds}
						sortField={sortField}
						sortOrder={sortOrder}
						toggleSort={toggleSort}
					/>

					{/* Sentinel element for infinite scroll detection */}
					<div ref={sentinelRef} style={{ height: "20px", margin: "10px 0" }} />

					{/* Loading more indicator */}
					{loading && tasks.length > 0 && (
						<div className={styles.scrollLoading}>
							<div className={styles.spinnerSmall} />
							<p>Loading more tasks...</p>
						</div>
					)}
				</>
			)}
		</div>
	);
}
