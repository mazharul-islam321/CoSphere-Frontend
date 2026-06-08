import React from "react";
import { Search, Filter, X } from "lucide-react";
import styles from "./TaskFilters.module.css";

interface UserSelect {
	id: string;
	name: string;
	role: string;
}

interface TaskFiltersProps {
	search: string;
	setSearch: (value: string) => void;
	statusFilter: string;
	setStatusFilter: (value: string) => void;
	priorityFilter: string;
	setPriorityFilter: (value: string) => void;
	assigneeFilter: string;
	setAssigneeFilter: (value: string) => void;
	deadlineFilter: string;
	setDeadlineFilter: (value: string) => void;
	teamMembers: UserSelect[];
	onClearFilters: () => void;
}

export default function TaskFilters({
	search,
	setSearch,
	statusFilter,
	setStatusFilter,
	priorityFilter,
	setPriorityFilter,
	assigneeFilter,
	setAssigneeFilter,
	deadlineFilter,
	setDeadlineFilter,
	teamMembers,
	onClearFilters,
}: TaskFiltersProps) {
	return (
		<div className={styles.filterPanel}>
			<div className={styles.filterHeader}>
				<div className={styles.filterTitle}>
					<Filter size={18} />
					<span>Search & Filter Tasks</span>
				</div>
				<button
					onClick={onClearFilters}
					className={styles.clearFiltersBtn}
				>
					<X size={14} />
					<span>Clear Filters</span>
				</button>
			</div>

			<div className={styles.filtersGrid}>
				{/* Search */}
				<div
					className={styles.filterGroup}
					style={{ gridColumn: "span 2", minWidth: "240px" }}
				>
					<span className={styles.filterLabel}>Search</span>
					<div style={{ position: "relative" }}>
						<Search
							style={{
								position: "absolute",
								left: "0.75rem",
								top: "50%",
								transform: "translateY(-50%)",
								color: "var(--text-tertiary)",
							}}
							size={16}
						/>
						<input
							type="text"
							className={styles.searchInput}
							style={{
								paddingLeft: "2.25rem",
								width: "100%",
							}}
							placeholder="Search tasks..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
				</div>

				{/* Status */}
				<div className={styles.filterGroup}>
					<span className={styles.filterLabel}>Status</span>
					<select
						className={styles.filterSelect}
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
					>
						<option value="ALL">All Statuses</option>
						<option value="TODO">To Do</option>
						<option value="IN_PROGRESS">In Progress</option>
						<option value="COMPLETED">Completed</option>
					</select>
				</div>

				{/* Priority */}
				<div className={styles.filterGroup}>
					<span className={styles.filterLabel}>Priority</span>
					<select
						className={styles.filterSelect}
						value={priorityFilter}
						onChange={(e) => setPriorityFilter(e.target.value)}
					>
						<option value="ALL">All Priorities</option>
						<option value="HIGH">High</option>
						<option value="MEDIUM">Medium</option>
						<option value="LOW">Low</option>
					</select>
				</div>

				{/* Assignee */}
				<div className={styles.filterGroup}>
					<span className={styles.filterLabel}>Assignee</span>
					<select
						className={styles.filterSelect}
						value={assigneeFilter}
						onChange={(e) => setAssigneeFilter(e.target.value)}
					>
						<option value="ALL">All Assignees</option>
						<option value="UNASSIGNED">Unassigned</option>
						{teamMembers.map((m) => (
							<option key={m.id} value={m.id}>
								{m.name}
							</option>
						))}
					</select>
				</div>

				{/* Deadlines */}
				<div className={styles.filterGroup}>
					<span className={styles.filterLabel}>
						Deadline Status
					</span>
					<select
						className={styles.filterSelect}
						value={deadlineFilter}
						onChange={(e) => setDeadlineFilter(e.target.value)}
					>
						<option value="ALL">All Deadlines</option>
						<option value="UPCOMING">Upcoming</option>
						<option value="OVERDUE">Overdue</option>
					</select>
				</div>
			</div>
		</div>
	);
}
