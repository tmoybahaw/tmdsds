// pages/index.tsx
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useEffect, useState } from 'react';

const API_KEY = 'ad301b7cc82ffe19273e55e4d4206885';
const API_BASE_URL = 'https://db.cineby.app/3';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);

  useEffect(() => {
    axios
      .get(\`\${API_BASE_URL}/movie/popular\`, {
        params: { api_key: API_KEY, language: 'en' },
      })
      .then((res) => setMovies(res.data.results))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await axios.get(\`\${API_BASE_URL}/search/movie\`, {
        params: { api_key: API_KEY, query, language: 'en' },
      });
      setSearchResults(res.data.results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayedMovies = searchResults.length > 0 ? searchResults : movies;

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <Head>
        <title>Tambayan Movie Explorer</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6 text-center">Tambayan Movie Explorer</h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          className="w-full max-w-md px-4 py-2 rounded-l bg-gray-800 text-white border border-gray-600"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-r"
        >
          Search
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {displayedMovies.map((movie) => (
            <Link key={movie.id} href={\`/movie/\${movie.id}\`}>
              <div className="cursor-pointer hover:scale-105 transition-transform">
                <Image
                  src={\`https://image.tmdb.org/t/p/w300\${movie.poster_path}\`}
                  alt={movie.title}
                  width={300}
                  height={450}
                  className="rounded-lg"
                />
                <p className="mt-2 text-sm text-center truncate">{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
