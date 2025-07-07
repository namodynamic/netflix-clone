"use client";

import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import MovieRow from "../components/MovieRow";
import { mockGames } from "../data/mockData";
import {
  fetchMovieGenres,
  fetchMoviesByGenre,
  fetchNowPlayingMovies,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchTopTVShows,
  fetchPopularTVShows,
} from "../api/tmdb";
import type { Movie } from "../types";

interface Genre {
  name: string;
  id: number;
}

const Home = () => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topTvShows, setTopTVShows] = useState<Movie[]>([]);
  const [popularTvShows, setPopularTopTVShows] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchPopularMovies(),
      fetchTopTVShows(),
      fetchTopRatedMovies(),
      fetchNowPlayingMovies(),
      fetchMovieGenres(),
      fetchPopularTVShows(),
    ])
      .then(
        ([
          moviesData,
          topTvShowsData,
          topRatedMovies,
          nowPlayingMovies,
          genres,
          popularTvShowData,
        ]) => {
          setPopularMovies(moviesData);
          setTopTVShows(topTvShowsData);
          setPopularTopTVShows(popularTvShowData);
          setTopRatedMovies(topRatedMovies);
          setNowPlayingMovies(nowPlayingMovies);

          const actionGenre = genres.find((g: Genre) => g.name === "Action");
          if (actionGenre) {
            fetchMoviesByGenre(actionGenre.id).then((movies) => {
              setActionMovies(movies.slice(0, 10));
            });
          }
        }
      )
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to load content. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  const featuredMovie =
    popularMovies.length > 0
      ? popularMovies[Math.floor(Math.random() * popularMovies.length)]
      : undefined;
  const top10Movies = topRatedMovies.slice(0, 10);
  const newOnNetflix = [...popularMovies]
    .filter((movie) => movie.release_date)
    .sort((a, b) => (b.release_date ?? "").localeCompare(a.release_date ?? ""))
    .slice(0, 10);
  const continueWatching = nowPlayingMovies.slice(0, 10);
  const topPickMovies = [...popularMovies]
    .filter((movie) => (movie.vote_count ?? 0) >= 1000)
    .sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0))
    .slice(0, 10);

  const top10TVShows = topTvShows.slice(0, 10);
  const criticallyAcclaimed = popularTvShows.slice(0, 10);

  const RECENT_DAYS = 30;
  const now = new Date();
  const recentlyAddedIds = [
    ...popularMovies
      .filter((movie) => {
        if (!movie.release_date) return false;
        const release = new Date(movie.release_date);
        const diffDays =
          (now.getTime() - release.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= RECENT_DAYS;
      })
      .map((movie) => movie.id),
    ...popularTvShows
      .filter((show) => {
        if (!show.first_air_date) return false;
        const release = new Date(show.first_air_date);
        const diffDays =
          (now.getTime() - release.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= RECENT_DAYS;
      })
      .map((show) => show.id),
  ];

  if (error) {
    return (
      <main className="bg-zinc-950 min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-zinc-950 min-h-screen overflow-hidden">
      {featuredMovie && <Hero movieId={featuredMovie.id} />}

      <div className="relative bottom-0 mt-48 md:mt-36 lg:-top-20 lg:-mt-68  xl:top-10 z-10 pb-8 sm:pb-12 mb-8">
        <div className="space-y-6 sm:space-y-8 lg:space-y-12">
          <MovieRow
            title="New on Netflix"
            movies={newOnNetflix}
            loading={loading}
            top10Ids={top10Movies.map((m) => m.id)}
          />

          <MovieRow
            title="Top 10 Movies Today"
            movies={top10Movies}
            showRanking={true}
            loading={loading}
            recentlyAddedIds={recentlyAddedIds}
          />

          <MovieRow
            title="Top 10 TV Shows Today"
            movies={top10TVShows}
            showRanking={true}
            loading={loading}
            recentlyAddedIds={recentlyAddedIds}
          />

          <MovieRow
            title="Critically Acclaimed TV Shows"
            movies={criticallyAcclaimed}
            loading={loading}
          />

          <section className="px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-white">
              Popular Mobile Games for You
            </h2>
            <div className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {mockGames.map((game) => (
                <div key={game.id} className="flex-shrink-0 text-center group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-2 sm:mb-3 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-200 transform group-hover:scale-105">
                    <img
                      src={game.icon || "/placeholder.svg?height=96&width=96"}
                      alt={game.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-300 group-hover:text-white transition-colors max-w-[80px] sm:max-w-[100px] mx-auto leading-tight">
                    {game.name}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <MovieRow
            title="Get In on the Action"
            movies={actionMovies}
            loading={loading}
            recentlyAddedIds={recentlyAddedIds}
          />

          <MovieRow
            title="Continue Watching"
            movies={continueWatching}
            loading={loading}
            recentlyAddedIds={recentlyAddedIds}
          />

          <MovieRow
            title="Today's Top Picks for You"
            movies={topPickMovies}
            loading={loading}
            recentlyAddedIds={recentlyAddedIds}
          />
        </div>
      </div>
    </main>
  );
};

export default Home;
