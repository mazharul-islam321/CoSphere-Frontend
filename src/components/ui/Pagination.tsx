import React from "react";
import styles from "./Pagination.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
	currentPage: number;
	limit: number;
	total: number;
	onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	limit,
	total,
	onPageChange,
}) => {
	const totalPages = Math.ceil(total / limit) || 1;
	const startItem = (currentPage - 1) * limit + 1;
	const endItem = Math.min(currentPage * limit, total);

	const pages = [];
	const maxPageVisible = 5;
	let startPage = Math.max(1, currentPage - 2);
	const endPage = Math.min(totalPages, startPage + maxPageVisible - 1);

	if (endPage - startPage < maxPageVisible - 1) {
		startPage = Math.max(1, endPage - maxPageVisible + 1);
	}

	for (let i = startPage; i <= endPage; i++) {
		pages.push(i);
	}

	if (total === 0) return null;

	return (
		<div className={styles.paginationContainer}>
			<div className={styles.info}>
				Showing <span className={styles.highlight}>{startItem}</span> to{" "}
				<span className={styles.highlight}>{endItem}</span> of{" "}
				<span className={styles.highlight}>{total}</span> entries
			</div>
			<div className={styles.pagesList}>
				<button
					className={styles.pageButton}
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
					aria-label="Previous page"
				>
					<ChevronLeft size={16} />
				</button>

				{startPage > 1 && (
					<>
						<button
							className={styles.pageButton}
							onClick={() => onPageChange(1)}
						>
							1
						</button>
						{startPage > 2 && <span className={styles.ellipsis}>...</span>}
					</>
				)}

				{pages.map((p) => (
					<button
						key={p}
						className={`${styles.pageButton} ${p === currentPage ? styles.active : ""}`}
						onClick={() => onPageChange(p)}
					>
						{p}
					</button>
				))}

				{endPage < totalPages && (
					<>
						{endPage < totalPages - 1 && (
							<span className={styles.ellipsis}>...</span>
						)}
						<button
							className={styles.pageButton}
							onClick={() => onPageChange(totalPages)}
						>
							{totalPages}
						</button>
					</>
				)}

				<button
					className={styles.pageButton}
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					aria-label="Next page"
				>
					<ChevronRight size={16} />
				</button>
			</div>
		</div>
	);
};

export default Pagination;
