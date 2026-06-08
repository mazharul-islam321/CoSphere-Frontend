'use client';

import React from 'react';
import styles from './Badge.module.css';

type BadgeType = 
  | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD'
  | 'TODO' | 'IN_PROGRESS'
  | 'HIGH' | 'MEDIUM' | 'LOW';

interface BadgeProps {
  value: BadgeType | string;
  variant?: 'status' | 'priority';
  className?: string;
  style?: React.CSSProperties;
}

export default function Badge({ value, variant = 'status', className = '', style }: BadgeProps) {
  const normalizedValue = value.toUpperCase().replace('-', '_');

  if (variant === 'priority') {
    const priorityClass = styles[`priority${normalizedValue}`] || '';
    return (
      <span className={`${styles.priorityBadge} ${priorityClass} ${className}`} style={style}>
        {value}
      </span>
    );
  }

  const statusClass = styles[`status${normalizedValue}`] || '';
  return (
    <span className={`${styles.badge} ${statusClass} ${className}`} style={style}>
      {value.replace('_', ' ')}
    </span>
  );
}
