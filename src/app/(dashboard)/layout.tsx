'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { useLogoutMutation } from '../../redux/api/authApi';
import { clearCredentials, selectCurrentUser, selectAuthLoading } from '../../redux/features/authSlice';
import { useTheme } from '../../context/ThemeContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  ListTodo, 
  Users, 
  Sun, 
  Moon, 
  LogOut, 
  Menu, 
  X
} from 'lucide-react';
import styles from './dashboardLayout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectAuthLoading);
  const dispatch = useAppDispatch();
  const [logoutTrigger] = useLogoutMutation();

  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logoutTrigger().unwrap();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      dispatch(clearCredentials());
      router.replace('/login');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-secondary)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid var(--border-color)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s infinite linear',
          marginBottom: '1rem'
        }} />
        <p>Restoring session...</p>
        <style jsx global>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return null; // Don't show layout if redirecting
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: Briefcase },
    { name: 'Tasks', href: '/tasks', icon: ListTodo },
    { name: 'Team Workload', href: '/team', icon: Users },
  ];

  const getHeaderTitle = () => {
    const activeItem = navItems.find(item => pathname === item.href || pathname.startsWith(item.href + '/'));
    return activeItem ? activeItem.name : 'System';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className={styles.layoutContainer}>
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 99
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/dashboard" className={styles.logoLink}>
            <span className={styles.logoText}>CoSphere</span>
          </Link>
          <button 
            className={`${styles.iconBtn} ${styles.menuToggle}`}
            onClick={() => setSidebarOpen(false)}
            style={{ marginLeft: 'auto', width: '32px', height: '32px' }}
          >
            <X size={16} />
          </button>
        </div>

        <nav className={styles.navLinks}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.profileCard}>
            <div className={styles.avatar}>
              {getInitials(user.name)}
            </div>
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>{user.name}</span>
              <span className={styles.profileRole}>
                {user.role === 'ADMIN' ? 'Administrator' : user.role === 'PROJECT_MANAGER' ? 'Project Manager' : 'Team Member'}
              </span>
            </div>
          </div>
          
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainWrapper}>
        <header className={styles.topHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              className={`${styles.iconBtn} ${styles.menuToggle}`}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h2 className={styles.headerTitle}>{getHeaderTitle()}</h2>
          </div>

          <div className={styles.headerActions}>
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className={styles.iconBtn} title="Toggle Dark/Light Mode">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        <main className={styles.contentContainer}>
          {children}
        </main>
      </div>
    </div>
  );
}
