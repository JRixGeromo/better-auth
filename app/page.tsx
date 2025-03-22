import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>Welcome to BetterAuth Demo</h1>
      <div>
        <Link href="/signup">Sign Up</Link>
      </div>
    </main>
  );
}