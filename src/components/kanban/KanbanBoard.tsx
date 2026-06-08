'use client';

import React from 'react';
import KanbanColumn from '@/components/kanban/KanbanColumn';
import styles from './KanbanBoard.module.css';

interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | string;
  assignedMember: { id: string; name: string } | null;
}

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export default function KanbanBoard({ tasks = [], onTaskClick }: KanbanBoardProps) {
  const todoTasks = tasks.filter((t) => t.status === 'TODO');
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED');

  return (
    <div className={styles.kanbanBoard}>
      <KanbanColumn 
        title="To Do" 
        tasks={todoTasks} 
        onTaskClick={onTaskClick} 
      />
      <KanbanColumn 
        title="In Progress" 
        tasks={inProgressTasks} 
        onTaskClick={onTaskClick} 
      />
      <KanbanColumn 
        title="Completed" 
        tasks={completedTasks} 
        onTaskClick={onTaskClick} 
      />
    </div>
  );
}
