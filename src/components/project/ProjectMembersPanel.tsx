'use client';

import React from 'react';
import { UserPlus, X } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import styles from './ProjectMembersPanel.module.css';

interface UserSelect {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ProjectMembersPanelProps {
  project: {
    creatorId: string;
    creator?: {
      name: string;
    };
    members?: UserSelect[];
  };
  canEdit: boolean;
  onAddMemberClick: () => void;
  onRemoveMemberClick: (memberId: string) => void;
}

export default function ProjectMembersPanel({
  project,
  canEdit,
  onAddMemberClick,
  onRemoveMemberClick,
}: ProjectMembersPanelProps) {
  return (
    <div className={styles.membersPanel}>
      <div className={styles.panelTitleRow}>
        <h3 className={styles.panelTitle}>Project Team</h3>
        {canEdit && (
          <button onClick={onAddMemberClick} className={styles.addMemberBtn}>
            <UserPlus size={12} />
            <span>Add</span>
          </button>
        )}
      </div>

      <div className={styles.membersList}>
        {/* Show Manager / Creator */}
        {project.creator && (
          <div className={styles.memberItem}>
            <div className={styles.memberInfo}>
              <Avatar 
                name={project.creator.name} 
                backgroundColor="var(--accent)"
                size={32} 
              />
              <div>
                <div style={{ fontWeight: 700 }}>{project.creator.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Manager (Creator)</div>
              </div>
            </div>
          </div>
        )}

        {/* Show other members */}
        {(project.members || [])
          .filter((m) => m.id !== project.creatorId)
          .map((member) => (
            <div key={member.id} className={styles.memberItem}>
              <div className={styles.memberInfo}>
                <Avatar name={member.name} size={32} />
                <div>
                  <div style={{ fontWeight: 600 }}>{member.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                    {member.role === 'PROJECT_MANAGER' ? 'Project Manager' : 'Team Member'}
                  </div>
                </div>
              </div>
              {canEdit && (
                <X 
                  className={styles.removeMember} 
                  size={14} 
                  onClick={() => onRemoveMemberClick(member.id)} 
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
