// pages/movie/[...params].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import axios from 'axios';

const API_KEY = 'ad301b7cc82ffe19273e55e4d4206885';
const API_BASE_URL = 'https://db.cineby.app/3';

const fetchMovieDetails = async (id: string) => {
  const { data } = await axios.get(\`\${API_BASE_URL}/movie/\${id}\`, {
    params: {
      api_key: API_KEY,
      language: 'en',
      append_to_response: 'credits,external_ids,videos,recommendations,translations,similar',
    },
  });
  return data;
};

export default function MoviePage() {
  const router = useRouter();
  const { params } = router.query;

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params || !Array.isArray(params)) return;
    const movieId = params[0];

    fetchMovieDetails(movieId)
      .then(setMovie)
      .finally(() => setLoading(false));
  }, [params]);

  if (loading) return <p className="text-center p-8">Loading...</p>;
  if (!movie) return <p className="text-center p-8 text-red-500">Movie not found.</p>;

  const posterUrl = \`https://image.tmdb.org/t/p/w500\${movie.poster_path}\`;
  const backdropUrl = \`https://image.tmdb.org/t/p/original\${movie.backdrop_path}\`;
  const trailer = movie.videos?.results?.find((v: any) => v.type === 'Trailer');
  const cast = movie.credits?.cast?.slice(0, 12);

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>{movie.title || 'Movie Details'}</title>
      </Head>

      {movie.backdrop_path && (
        <div className="relative w-full h-96 overflow-hidden">
          <Image
            src={backdropUrl}
            alt="Backdrop"
            layout="fill"
            objectFit="cover"
            className="opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
        </div>
      )}

      <div className="max-w-5xl mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <img src={posterUrl} alt={movie.title} className="w-64 rounded-xl shadow-lg" />
          <div>
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            <p className="text-sm text-gray-400 mb-4">{movie.release_date} • {movie.runtime} min</p>
            <p className="text-lg leading-relaxed">{movie.overview}</p>
            {trailer && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Trailer</h2>
                <iframe
                  width="100%"
                  height="315"
                  src={\`https://www.youtube.com/embed/\${trailer.key}\`}
                  title="YouTube trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
