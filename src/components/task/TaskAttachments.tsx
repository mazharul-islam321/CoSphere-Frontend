/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef } from "react";
import { Paperclip, Plus } from "lucide-react";
import { useAddAttachmentMutation } from "@/redux/api/tasksApi";
import styles from "./TaskDetailsModal.module.css";

interface Attachment {
	id: string;
	fileName: string;
	fileUrl: string;
	createdAt: string;
}

interface TaskAttachmentsProps {
	taskId: string;
	attachments: Attachment[];
	isCollaborator: boolean;
}

export default function TaskAttachments({
	taskId,
	attachments = [],
	isCollaborator,
}: TaskAttachmentsProps) {
	const [addAttachment, { isLoading: uploadingAttachment }] =
		useAddAttachmentMutation();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleUploadAttachment = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("file", file);

		try {
			await addAttachment({ taskId, formData }).unwrap();
		} catch (err: any) {
			alert(
				err?.data?.message || err.message || "Failed to upload file.",
			);
		} finally {
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};

	// Derive static files server URL
	const apiBaseUrl =
		process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";
	const fileServerUrl = apiBaseUrl.replace(/\/api$/, "");

	return (
		<div className={styles.attachmentsContainer}>
			<h3 className={styles.sectionTitle}>Attachments</h3>
			<div className={styles.attachmentsList}>
				{attachments.map((att) => (
					<div key={att.id} className={styles.attachmentItem}>
						<Paperclip size={12} />
						<a
							href={`${fileServerUrl}${att.fileUrl}`}
							target="_blank"
							rel="noopener noreferrer"
							className={styles.attachmentLink}
						>
							{att.fileName}
						</a>
					</div>
				))}

				{isCollaborator && (
					<div className={styles.uploadForm}>
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleUploadAttachment}
							className={styles.fileInput}
						/>
						<button
							onClick={() => fileInputRef.current?.click()}
							className={styles.uploadTrigger}
							disabled={uploadingAttachment}
						>
							<Plus size={12} />
							<span>
								{uploadingAttachment
									? "Uploading..."
									: "Attach File"}
							</span>
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
