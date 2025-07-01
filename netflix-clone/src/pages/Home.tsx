import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPopularMovies } from "../api/tmdb";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
};

const SkeletonCard = () => (
  <div className="animate-pulse bg-zinc-800 rounded-lg h-72 w-full" />
);

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularMovies()
      .then((data) => setMovies(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Popular Movies</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
          : movies.map((movie) => (
              <Link to={`/movie/${movie.id}`} key={movie.id} className="group block">
                <div className="relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="rounded-lg shadow-md group-hover:scale-105 transition-transform duration-200"
                  />
                  <span className="absolute top-2 right-2 bg-zinc-900/80 text-yellow-400 text-xs px-2 py-1 rounded font-bold">
                    ★ {movie.vote_average}
                  </span>
                </div>
                <p className="mt-2 text-center text-sm font-medium truncate" title={movie.title}>
                  {movie.title}
                </p>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default Home; 