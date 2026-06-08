import React from "react";
import { Search } from "lucide-react";
import styles from "./TeamToolbar.module.css";

interface TeamToolbarProps {
	searchQuery: string;
	setSearchQuery: (value: string) => void;
}

export default function TeamToolbar({
	searchQuery,
	setSearchQuery,
}: TeamToolbarProps) {
	return (
		<div className={styles.toolbar}>
			<div className={styles.searchWrapper}>
				<Search className={styles.searchIcon} size={18} />
				<input
					type="text"
					className={styles.searchInput}
					placeholder="Search team members by name..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>
		</div>
	);
}
