'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Navigation.module.css';

export function Navigation() {
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">Better Auth</Link>
      </div>
      <div className={styles.buttons}>
        {!isDashboard ? (
          <>
            <Link href="/login" className={styles.button}>
              Sign In
            </Link>
            <Link href="/signup" className={`${styles.button} ${styles.primary}`}>
              Sign Up
            </Link>
          </>
        ) : null}
      </div>
    </nav>
  );
}
