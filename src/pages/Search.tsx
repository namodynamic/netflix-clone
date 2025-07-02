"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { mockMovies, mockTVShows } from "../data/Mockdata"

interface SearchProps {
  searchQuery: string
}

const Search = ({ searchQuery }: SearchProps) => {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (searchQuery.trim()) {
      setLoading(true)
      // Simulate search delay
      const timer = setTimeout(() => {
        const allContent = [...mockMovies, ...mockTVShows]
        const filtered = allContent.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
        setResults(filtered)
        setLoading(false)
      }, 500)

      return () => clearTimeout(timer)
    } else {
      setResults([])
    }
  }, [searchQuery])

  if (!searchQuery.trim()) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white pt-24 px-8">
        <h1 className="text-3xl font-bold mb-8">Search</h1>
        <p className="text-gray-400">Enter a search term to find movies and TV shows.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white pt-24 px-8">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-gray-400 mb-8">
        {loading ? "Searching..." : `${results.length} results for "${searchQuery}"`}
      </p>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-zinc-800 rounded-lg h-72" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {results.map((item) => (
            <Link key={item.id} to={`/movie/${item.id}`} className="group">
              <img
                src={item.poster_path || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-72 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
              />
              <p className="mt-2 text-sm font-medium truncate">{item.title}</p>
              <p className="text-xs text-gray-400">★ {item.vote_average.toFixed(1)}</p>
            </Link>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-gray-400">No results found for "{searchQuery}"</p>
          <p className="text-gray-500 mt-2">Try different keywords or browse our categories</p>
        </div>
      )}
    </div>
  )
}

export default Search
