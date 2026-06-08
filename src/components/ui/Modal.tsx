'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: number; // custom maximum width in pixels, e.g. 500 or 768
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 500,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const hasTitle = !!title;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div 
        ref={modalRef} 
        className={styles.modal} 
        style={{ maxWidth: `${maxWidth}px` }}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        {hasTitle ? (
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>{title}</h2>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
              <X size={20} />
            </button>
          </div>
        ) : (
          <button className={styles.absoluteCloseBtn} onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
