'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../redux/store';
import { selectCurrentUser, selectAuthLoading } from '../redux/features/authSlice';
import styles from './page.module.css';

export default function Home() {
  const user = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectAuthLoading);
  const router = useRouter();

  console.log('[Home Page] Render - state:', { loading, user: user ? user.email : null });

  useEffect(() => {
    console.log('[Home Page] useEffect triggered - state:', { loading, user: user ? user.email : null });
    if (!loading) {
      if (user) {
        console.log('[Home Page] Redirecting to /dashboard');
        router.replace('/dashboard');
      } else {
        console.log('[Home Page] Redirecting to /login');
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>Loading Smart Collaboration System...</p>
    </div>
  );
}
