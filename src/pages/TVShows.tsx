"use client";

import { useState, useEffect } from "react";
import MovieRow from "../components/MovieRow";
import { fetchPopularTVShows, fetchTrendingTVShows } from "../api/tmdb";
import type { Movie } from "../types";
import Hero from "../components/Hero";

const TVShows = () => {
  const [loading, setLoading] = useState(true);
  const [popularTvShows, setPopularTopTVShows] = useState<Movie[]>([]);
  const [trendingTvShows, setTrendingTVShows] = useState<Movie[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchPopularTVShows(), fetchTrendingTVShows()])
      .then(([popularTvShowData, trendingTvShowData]) => {
        setPopularTopTVShows(popularTvShowData);
        setTrendingTVShows(trendingTvShowData);
      })
      .finally(() => setLoading(false));
  }, []);

  const comedyMovies = popularTvShows.filter((tv) =>
    tv.genre_ids?.includes(35)
  );
  const dramaMovies = popularTvShows.filter((tv) => tv.genre_ids?.includes(18));

  const featuredMovie =
    trendingTvShows.length > 0
      ? trendingTvShows[Math.floor(Math.random() * trendingTvShows.length)]
      : undefined;

  return (
    <div className="min-h-screen bg-zinc-950 overflow-hidden">
      {featuredMovie && <Hero mediaId={featuredMovie.id} mediaType="tv" />}
      <div className="relative bottom-0 mt-48 md:mt-36 lg:-top-20 lg:-mt-68  xl:top-10 z-10 pb-8 sm:pb-12 mb-8">
        <div className="px-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">TV Shows</h1>
          <p className="text-gray-400">Discover amazing TV series and shows</p>
        </div>

        <MovieRow
          title="Popular TV Shows"
          movies={popularTvShows.slice(0, 10)}
          loading={loading}
        />

        <MovieRow
          title="Trending Now"
          movies={trendingTvShows.slice(1, 10)}
          loading={loading}
        />

        <MovieRow
          title="Drama Series"
          movies={dramaMovies.slice(0, 20)}
          loading={loading}
        />

        <MovieRow
          title="Comedy Shows"
          movies={comedyMovies.slice(0, 20)}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default TVShows;
