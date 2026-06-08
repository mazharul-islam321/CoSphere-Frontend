'use client';

import React from 'react';
import styles from './Avatar.module.css';

interface AvatarProps {
  name: string;
  size?: number; // size in pixels
  backgroundColor?: string; // e.g. 'var(--accent)'
  className?: string;
  title?: string;
}

export default function Avatar({
  name,
  size = 32,
  backgroundColor,
  className = '',
  title,
}: AvatarProps) {
  const getInitials = (fullName: string) => {
    if (!fullName) return '';
    return fullName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const initials = getInitials(name);
  
  // Dynamically calculate font size based on avatar size (ratio approx 0.4)
  const fontSize = `${size * 0.4}px`;

  const inlineStyles: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    fontSize,
    ...(backgroundColor ? { background: backgroundColor } : {}),
  };

  return (
    <div 
      className={`${styles.avatarCircle} ${className}`} 
      style={inlineStyles}
      title={title || name}
    >
      {initials}
    </div>
  );
}
