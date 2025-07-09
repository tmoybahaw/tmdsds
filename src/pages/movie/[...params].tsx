import { useRouter } from 'next/router';

export default function MovieDetails() {
  const router = useRouter();
  const { params } = router.query;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold">Movie ID: {params?.[0]}</h1>
    </div>
  );
}
