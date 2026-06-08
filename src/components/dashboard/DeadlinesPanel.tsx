'use client';

import React from 'react';
import styles from './DeadlinesPanel.module.css';

interface TaskDeadline {
  id: string;
  title: string;
  dueDate: string;
  project?: {
    name: string;
  };
}

interface DeadlinesPanelProps {
  upcomingDeadlines: TaskDeadline[];
}

export default function DeadlinesPanel({ upcomingDeadlines = [] }: DeadlinesPanelProps) {
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={styles.sideCard}>
      <h3 className={styles.sideCardTitle}>Upcoming Deadlines</h3>
      <div className={styles.listScrollable}>
        {upcomingDeadlines.length === 0 ? (
          <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
            No upcoming pending deadlines.
          </div>
        ) : (
          upcomingDeadlines.map((task) => {
            const isOverdue = new Date(task.dueDate).getTime() < new Date().getTime();
            return (
              <div 
                key={task.id} 
                className={`${styles.deadlineItem} ${isOverdue ? styles.deadlineOverdue : ''}`}
              >
                <div className={styles.deadlineInfo}>
                  <span className={styles.deadlineTaskTitle}>{task.title}</span>
                  <span className={styles.deadlineProj}>{task.project?.name || 'Unknown Project'}</span>
                </div>
                <span className={`${styles.deadlineDate} ${isOverdue ? styles.dateOverdue : ''}`}>
                  {formatDate(task.dueDate)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
