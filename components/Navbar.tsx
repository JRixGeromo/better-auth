'use client';

import Link from 'next/link';
import styles from './Navbar.module.css';

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">Better Auth</Link>
      </div>
      <div className={styles.buttons}>
        <Link href="/login" className={styles.button}>
          Sign In
        </Link>
        <Link href="/signup" className={`${styles.button} ${styles.primary}`}>
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
