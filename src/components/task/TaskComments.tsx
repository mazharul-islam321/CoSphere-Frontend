/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { useAddCommentMutation } from "@/redux/api/tasksApi";
import styles from "./TaskDetailsModal.module.css";

interface Comment {
	id: string;
	content: string;
	createdAt: string;
	author: { id: string; name: string };
}

interface TaskCommentsProps {
	taskId: string;
	comments: Comment[];
	isCollaborator: boolean;
}

export default function TaskComments({
	taskId,
	comments = [],
	isCollaborator,
}: TaskCommentsProps) {
	const [addComment, { isLoading: commentSubmitting }] =
		useAddCommentMutation();
	const [newComment, setNewComment] = useState("");

	const handleAddComment = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newComment.trim()) return;

		try {
			await addComment({ taskId, content: newComment }).unwrap();
			setNewComment("");
		} catch (err: any) {
			alert(
				err?.data?.message ||
					err.message ||
					"Failed to submit comment.",
			);
		}
	};

	const formatDate = (isoString: string) => {
		return new Date(isoString).toLocaleDateString([], {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	return (
		<div className={styles.commentsContainer}>
			<h3 className={styles.sectionTitle}>
				Discussion ({comments.length})
			</h3>

			<div className={styles.commentsList}>
				{comments.length === 0 ? (
					<p
						style={{
							fontStyle: "italic",
							fontSize: "0.8rem",
							color: "var(--text-tertiary)",
							padding: "0.5rem 0",
						}}
					>
						No comments posted yet. Start the conversation!
					</p>
				) : (
					comments.map((comm) => (
						<div key={comm.id} className={styles.commentCard}>
							<div className={styles.commentAuthorRow}>
								<span>{comm.author?.name}</span>
								<span className={styles.commentTime}>
									{formatDate(comm.createdAt)}
								</span>
							</div>
							<p className={styles.commentContent}>
								{comm.content}
							</p>
						</div>
					))
				)}
			</div>

			{isCollaborator && (
				<form
					onSubmit={handleAddComment}
					className={styles.commentForm}
				>
					<input
						type="text"
						className={styles.commentInput}
						placeholder="Write a message..."
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						disabled={commentSubmitting}
						required
					/>
					<button
						type="submit"
						className={styles.commentSubmit}
						disabled={commentSubmitting}
					>
						<Send size={14} />
					</button>
				</form>
			)}
		</div>
	);
}
