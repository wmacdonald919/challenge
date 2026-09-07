import Link from 'next/link';

export default function Home() {
  return (
    <main className='app-main flex flex-1 flex-col items-center justify-center gap-4 p-8'>
      <h1 className='text-4xl font-semibold'>PennyLane Support</h1>
      <nav className='flex gap-4 text-sm underline'>
        <Link href='/challenges'>Challenges</Link>
        <Link href='/admin'>Admin</Link>
      </nav>
    </main>
  );
}
