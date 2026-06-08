'use client';

import React from 'react';
import { Edit, Trash2, Calendar, User } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import styles from './ProjectHeader.module.css';

interface ProjectHeaderProps {
  project: {
    name: string;
    status: string;
    deadline: string;
    description: string | null;
    creator?: {
      name: string;
    };
  };
  canEdit: boolean;
  isAdmin: boolean;
  isCreator: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export default function ProjectHeader({
  project,
  canEdit,
  isAdmin,
  isCreator,
  onEditClick,
  onDeleteClick,
}: ProjectHeaderProps) {
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={styles.projectHeaderCard}>
      <div className={styles.headerRow}>
        <div className={styles.titleSection}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 className={styles.projectName}>{project.name}</h1>
            <Badge value={project.status} />
          </div>
          <div className={styles.projectMeta}>
            <div className={styles.metaItem}>
              <Calendar size={14} />
              <span>Deadline: {formatDate(project.deadline)}</span>
            </div>
            <div className={styles.metaItem}>
              <User size={14} />
              <span>Managed by: {project.creator?.name || 'Unknown'}</span>
            </div>
          </div>
        </div>

        {canEdit && (
          <div className={styles.actionBtns}>
            <button onClick={onEditClick} className={styles.editBtn}>
              <Edit size={14} />
              <span>Edit Project</span>
            </button>
            {(isAdmin || isCreator) && (
              <button onClick={onDeleteClick} className={styles.deleteBtn}>
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            )}
          </div>
        )}
      </div>

      <p className={styles.projectDesc}>
        {project.description || 'No description provided for this project.'}
      </p>
    </div>
  );
}
