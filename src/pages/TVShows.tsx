"use client"

import { useState, useEffect } from "react"
import MovieRow from "../components/MovieRow"
import { mockTVShows } from "../data/Mockdata"

const TVShows = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-zinc-900 text-white pt-24">
      <div className="px-8 mb-8">
        <h1 className="text-4xl font-bold mb-4">TV Shows</h1>
        <p className="text-gray-400">Discover amazing TV series and shows</p>
      </div>

      <MovieRow title="Popular TV Shows" movies={mockTVShows.slice(0, 10)} loading={loading} />

      <MovieRow title="Trending Now" movies={mockTVShows.slice(5, 15)} loading={loading} />

      <MovieRow title="Drama Series" movies={mockTVShows.slice(10, 20)} loading={loading} />

      <MovieRow title="Comedy Shows" movies={mockTVShows.slice(15, 25)} loading={loading} />
    </div>
  )
}

export default TVShows
