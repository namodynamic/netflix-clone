"use client"

import { useEffect, useState } from "react"
import Hero from "../components/Hero"
import MovieRow from "../components/MovieRow"
import {  mockGames } from "../data/mockData"
import { fetchPopularMovies, fetchTVShows } from "../api/tmdb"

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


const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
     Promise.all([fetchPopularMovies(), fetchTVShows()])
       .then(([moviesData, tvShowsData]) => {
      setMovies(moviesData);
      setTVShows(tvShowsData);
    })
       .finally(() => setLoading(false));
   }, []);

  const featuredMovie = movies[0]
  const top10Movies = movies.slice(0, 10)
  const newOnNetflix = movies.slice(1, 11)
  const continueWatching = movies.slice(15, 25)
  const actionMovies = movies.filter((movie) => movie.genre_ids?.includes(28)).slice(0, 10)
  const topPickMovies = [...movies]
  .filter((movie) => (movie.vote_count ?? 0) >= 1000)
  .sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0))
  .slice(0, 10)

  const top10TVShows = tvShows.slice(0, 10)
  const criticallyAcclaimed = tvShows.slice(5, 15)

  return (
    <div className="bg-zinc-900 min-h-screen">
      {featuredMovie && <Hero movieId={featuredMovie.id} />}

      <div className="relative -mt-10 md:-mt-24 z-10">
        <MovieRow title="New on Netflix" movies={newOnNetflix} loading={loading} />

        <MovieRow title="Top 10 Movies Today" movies={top10Movies} showRanking={true} loading={loading} />

        <MovieRow title="Top 10 TV Shows Today" movies={top10TVShows} showRanking={true} loading={loading} />

        <MovieRow title="Critically Acclaimed TV Shows" movies={criticallyAcclaimed} loading={loading} />

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 px-8">Popular Mobile Games for You</h2>
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

        <MovieRow title="Get In on the Action" movies={actionMovies} loading={loading} />

        <MovieRow title="Continue Watching" movies={continueWatching} loading={loading} />

        <MovieRow title="Today's Top Picks for You" movies={topPickMovies} loading={loading} />
      </div>
    </div>
  )
}

export default Home
