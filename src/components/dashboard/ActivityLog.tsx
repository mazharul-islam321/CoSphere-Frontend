'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './ActivityLog.module.css';

interface Activity {
  id: string;
  description: string;
  timestamp: string;
}

interface ActivityLogProps {
  recentActivities: Activity[];
  projects?: { id: string; name: string }[];
}

export default function ActivityLog({ recentActivities = [], projects = [] }: ActivityLogProps) {
  const router = useRouter();

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const renderDescriptionWithShortcuts = (desc: string) => {
    const match = desc.match(/"([^"]+)"/);
    if (!match) {
      return <span className={styles.activityDesc}>{desc}</span>;
    }

    const entityName = match[1];
    const parts = desc.split(`"${entityName}"`);

    // Match if entity is a project in our projects array
    const matchedProject = projects.find((p) => p.name.toLowerCase() === entityName.toLowerCase());

    if (matchedProject) {
      return (
        <span className={styles.activityDesc}>
          {parts[0]}
          <span 
            className={styles.shortcutLink}
            onClick={() => router.push(`/projects/${matchedProject.id}`)}
            title={`Go to Project "${entityName}"`}
          >
            &quot;{entityName}&quot;
          </span>
          {parts[1]}
        </span>
      );
    }

    // Default to task search link
    return (
      <span className={styles.activityDesc}>
        {parts[0]}
        <span 
          className={styles.shortcutLink}
          onClick={() => router.push(`/tasks?search=${encodeURIComponent(entityName)}`)}
          title={`Search Task "${entityName}"`}
        >
          &quot;{entityName}&quot;
        </span>
        {parts[1]}
      </span>
    );
  };

  return (
    <div className={styles.sideCard}>
      <h3 className={styles.sideCardTitle}>Activity Log</h3>
      <div className={styles.listScrollable}>
        {recentActivities.length === 0 ? (
          <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
            No recent activities recorded.
          </div>
        ) : (
          recentActivities.map((act) => (
            <div key={act.id} className={styles.activityItem}>
              <div className={styles.activityDot} />
              <div className={styles.activityContent}>
                {renderDescriptionWithShortcuts(act.description)}
                <span className={styles.activityTime}>{formatTime(act.timestamp)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
