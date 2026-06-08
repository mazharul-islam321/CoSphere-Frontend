import React from "react";
import { Plus, Search } from "lucide-react";
import styles from "./ProjectToolbar.module.css";

interface ProjectToolbarProps {
	search: string;
	setSearch: (value: string) => void;
	statusFilter: string;
	setStatusFilter: (value: string) => void;
	sortOption: string;
	setSortOption: (value: string) => void;
	canCreate: boolean | null | undefined;
	onCreateClick: () => void;
}

export default function ProjectToolbar({
	search,
	setSearch,
	statusFilter,
	setStatusFilter,
	sortOption,
	setSortOption,
	canCreate,
	onCreateClick,
}: ProjectToolbarProps) {
	return (
		<div className={styles.toolbar}>
			<div className={styles.searchFilterGroup}>
				<div className={styles.searchWrapper}>
					<Search className={styles.searchIcon} size={18} />
					<input
						type="text"
						className={styles.searchInput}
						placeholder="Search projects by name..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<select
					className={styles.filterSelect}
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
				>
					<option value="ALL">All Statuses</option>
					<option value="ACTIVE">Active</option>
					<option value="COMPLETED">Completed</option>
					<option value="ON_HOLD">On Hold</option>
				</select>
				<select
					className={styles.filterSelect}
					value={sortOption}
					onChange={(e) => setSortOption(e.target.value)}
				>
					<option value="latest">Latest Created</option>
					<option value="deadline">Nearest Deadline</option>
				</select>
			</div>

			{canCreate && (
				<button
					onClick={onCreateClick}
					className={styles.createBtn}
				>
					<Plus size={18} />
					<span>Create Project</span>
				</button>
			)}
		</div>
	);
}
