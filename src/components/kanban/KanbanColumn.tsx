'use client';

import React from 'react';
import TaskCard from '@/components/kanban/TaskCard';
import styles from './KanbanColumn.module.css';

interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | string;
  assignedMember: { id: string; name: string } | null;
}

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export default function KanbanColumn({ title, tasks, onTaskClick }: KanbanColumnProps) {
  return (
    <div className={styles.kanbanColumn}>
      <div className={styles.columnHeader}>
        <span className={styles.columnTitle}>{title}</span>
        <span className={styles.taskCount}>{tasks.length}</span>
      </div>
      <div className={styles.tasksList}>
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onClick={() => onTaskClick(task)} 
          />
        ))}
      </div>
    </div>
  );
}
