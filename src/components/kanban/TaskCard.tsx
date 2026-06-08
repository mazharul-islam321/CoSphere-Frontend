'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import styles from './TaskCard.module.css';

interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | string;
  assignedMember: { id: string; name: string } | null;
}

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={styles.taskCard} onClick={onClick}>
      <div className={styles.taskCardHeader}>
        <Badge value={task.priority} variant="priority" />
      </div>
      <h4 className={styles.taskCardTitle}>{task.title}</h4>
      {task.description && <p className={styles.taskCardDesc}>{task.description}</p>}
      <div className={styles.taskCardFooter}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Calendar size={12} />
          {formatDate(task.dueDate)}
        </span>
        {task.assignedMember && (
          <Avatar 
            name={task.assignedMember.name} 
            size={24} 
            title={`Assigned to ${task.assignedMember.name}`}
          />
        )}
      </div>
    </div>
  );
}
