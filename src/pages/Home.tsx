import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPopularMovies } from "../api/tmdb";
import Hero from "../components/Hero";

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

  const featuredMovie = movies[0];
  const top10 = movies.slice(0, 10);

  return (
    <div className="bg-zinc-900">
      {featuredMovie && <Hero movieId={featuredMovie.id} />}
      <div className="px-8 mx-auto relative z-10">
        <h2 className="text-2xl font-bold mb-4">New on Netflix</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            : movies.slice(1, 11).map((movie) => (
                <Link to={`/movie/${movie.id}`} key={movie.id} className="group block min-w-[180px]">
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
        <h2 className="text-2xl font-bold mb-4 mt-8">Top 10 Movies</h2>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            : top10.map((movie, idx) => (
                <Link to={`/movie/${movie.id}`} key={movie.id} className="relative group block min-w-[200px]">
                  <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-[7rem] font-extrabold text-zinc-800 opacity-60 select-none z-10">
                    {idx + 1}
                  </span>
                  <div className="relative z-20">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="rounded-lg shadow-md group-hover:scale-105 transition-transform duration-200"
                    />
                    {(idx < 3) && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">Recently Added</span>
                    )}
                  </div>
                  <p className="mt-2 text-center text-sm font-medium truncate" title={movie.title}>
                    {movie.title}
                  </p>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 