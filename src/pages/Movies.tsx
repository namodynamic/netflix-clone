"use client";

import { useState, useEffect } from "react";
import MovieRow from "../components/MovieRow";
import type { Genre, Movie } from "../types";
import {
  fetchMovieGenres,
  fetchMoviesByGenre,
  fetchPopularMovies,
  fetchTopRatedMovies,
} from "../api/tmdb";

const Movies = () => {
  const [loading, setLoading] = useState(true);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [actionAndAdventureMovies, setActionAndAdventureMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);

  useEffect(() => {
    setLoading(true);
    fetchMovieGenres().then((genres) => {
      const actionGenre = genres.find((g: Genre) => g.name === "Action");
      const adventureGenre = genres.find((g: Genre) => g.name === "Adventure");

      Promise.all([
        actionGenre ? fetchMoviesByGenre(actionGenre.id) : [],
        adventureGenre ? fetchMoviesByGenre(adventureGenre.id) : [],
        fetchPopularMovies(),
        fetchTopRatedMovies(),
      ])
        .then(
          ([
            actionMoviesData,
            adventureMoviesData,
            moviesData,
            topRatedMovies,
          ]) => {
            setPopularMovies(moviesData);
            setTopRatedMovies(topRatedMovies);

            const combined = [
              ...actionMoviesData,
              ...adventureMoviesData,
            ].filter(
              (movie, idx, arr) =>
                arr.findIndex((m) => m.id === movie.id) === idx
            );
            setActionAndAdventureMovies(combined.slice(0, 20));
          }
        )
        .finally(() => setLoading(false));
    });
  }, []);

  const comedyMovies = popularMovies.filter((movie) =>
    movie.genre_ids?.includes(35)
  );
  const dramaMovies = popularMovies.filter((movie) =>
    movie.genre_ids?.includes(18)
  );

  const newOnNetflix = [...popularMovies]
    .filter((movie) => movie.release_date)
    .sort((a, b) => (b.release_date ?? "").localeCompare(a.release_date ?? ""))
    .slice(0, 15);

 
  const RECENT_DAYS = 30;
  const now = new Date();
  const recentlyAddedIds = popularMovies
    .filter((movie) => {
      if (!movie.release_date) return false;
      const releaseDate = new Date(movie.release_date);
      const daysSinceRelease =
        (now.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceRelease <= RECENT_DAYS;
    })
    .map((movie) => movie.id);

  return (
    <div className="min-h-screen bg-zinc-900 text-white pt-24">
      <div className="px-8 mb-8">
        <h1 className="text-4xl font-bold mb-4">Movies</h1>
        <p className="text-gray-400">Explore our vast collection of movies</p>
      </div>

      <MovieRow
        title="Popular Movies"
        movies={popularMovies.slice(0, 10)}
        loading={loading}
        recentlyAddedIds={recentlyAddedIds}
      />

      <MovieRow
        title="Action & Adventure"
        movies={actionAndAdventureMovies}
        loading={loading}
        recentlyAddedIds={recentlyAddedIds}
      />

      <MovieRow
        title="Comedy Movies"
        movies={comedyMovies.slice(0, 20)}
        loading={loading}
        recentlyAddedIds={recentlyAddedIds}
      />

      <MovieRow
        title="Drama"
        movies={dramaMovies.slice(0, 20)}
        loading={loading}
        recentlyAddedIds={recentlyAddedIds}
      />

      <MovieRow
        title="New Releases"
        movies={newOnNetflix}
        loading={loading}
        top10Ids={topRatedMovies.map((m) => m.id)}
      />
    </div>
  );
};

export default Movies;
