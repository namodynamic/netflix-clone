"use client"

import { useState, useEffect } from "react"
import MovieRow from "../components/MovieRow"
import { mockMovies } from "../data/Mockdata"

const Movies = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const actionMovies = mockMovies.filter((movie) => movie.genre_ids?.includes(28))
  const comedyMovies = mockMovies.filter((movie) => movie.genre_ids?.includes(35))
  const dramaMovies = mockMovies.filter((movie) => movie.genre_ids?.includes(18))

  return (
    <div className="min-h-screen bg-zinc-900 text-white pt-24">
      <div className="px-8 mb-8">
        <h1 className="text-4xl font-bold mb-4">Movies</h1>
        <p className="text-gray-400">Explore our vast collection of movies</p>
      </div>

      <MovieRow title="Popular Movies" movies={mockMovies.slice(0, 10)} loading={loading} />

      <MovieRow title="Action & Adventure" movies={actionMovies.slice(0, 10)} loading={loading} />

      <MovieRow title="Comedy Movies" movies={comedyMovies.slice(0, 10)} loading={loading} />

      <MovieRow title="Drama" movies={dramaMovies.slice(0, 10)} loading={loading} />

      <MovieRow title="New Releases" movies={mockMovies.slice(20, 30)} loading={loading} />
    </div>
  )
}

export default Movies
