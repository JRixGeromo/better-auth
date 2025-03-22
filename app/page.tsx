import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Welcome to BetterAuth Demo</h1>
      <p className={styles.description}>
        A secure authentication system built with Better Auth and Next.js
      </p>
    </main>
  );
}