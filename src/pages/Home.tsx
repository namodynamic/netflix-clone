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

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date?: string;
  genre_ids?: number[];
  vote_count?: number;
  first_air_date?: string;
};

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

  useEffect(() => {
    setLoading(true);
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
      .finally(() => setLoading(false));
  }, []);

  const featuredMovie = popularMovies[0];
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

  return (
    <div className="bg-zinc-900 min-h-screen">
      {featuredMovie && <Hero movieId={featuredMovie.id} />}

      <div className="relative -mt-10 md:-mt-24 z-10">
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

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 px-8">
            Popular Mobile Games for You
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 px-8">
            {mockGames.map((game) => (
              <div key={game.id} className="min-w-[120px] text-center">
                <img
                  src={game.icon || "/placeholder.svg"}
                  alt={game.name}
                  className="w-20 h-20 rounded-lg mx-auto mb-2"
                />
                <p className="text-xs font-medium">{game.name}</p>
              </div>
            ))}
          </div>
        </div>

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
  );
};

export default Home;
