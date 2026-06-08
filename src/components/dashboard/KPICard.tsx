'use client';

import React from 'react';
import styles from './KPICard.module.css';

interface KPICardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  iconBg: string; // inline background color, e.g. 'var(--primary-light)'
  iconColor: string; // inline color, e.g. 'var(--primary)'
}

export default function KPICard({
  icon,
  value,
  label,
  iconBg,
  iconColor,
}: KPICardProps) {
  return (
    <div className={styles.kpiCard}>
      <div 
        className={styles.kpiIcon} 
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        {icon}
      </div>
      <div className={styles.kpiInfo}>
        <span className={styles.kpiValue}>{value}</span>
        <span className={styles.kpiLabel}>{label}</span>
      </div>
    </div>
  );
}
