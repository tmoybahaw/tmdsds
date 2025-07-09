import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Tambayan Movie Explorer</h1>
      <Link href="/movie/123">
        <span className="text-blue-400 underline cursor-pointer">Go to Movie Details</span>
      </Link>
    </div>
  );
}
