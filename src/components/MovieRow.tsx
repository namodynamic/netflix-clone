"use client"

import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Movie {
  id: number
  title: string
  poster_path: string
  vote_average: number
  release_date?: string
  genre_ids?: number[]
  vote_count?: number
  first_air_date?: string
}



interface MovieRowProps {
  title: string
  movies: Movie[]
  showRanking?: boolean
  loading?: boolean
}

const SkeletonCard = () => <div className="animate-pulse bg-zinc-800 rounded-lg h-72 w-full min-w-[180px]" />

const MovieRow = ({ title, movies, showRanking = false, loading = false }: MovieRowProps) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount)
      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" })
    }
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 px-8">{title}</h2>

      <div className="relative group">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto pb-4 px-8 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            : movies.map((movie, idx) => (
                <Link
                  to={`/movie/${movie.id}`}
                  key={movie.id}
                  className={`group block min-w-[180px] ${showRanking ? "relative" : ""}`}
                >
                  {showRanking && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[8rem] font-extrabold text-zinc-400 opacity-60 select-none z-50 pointer-events-none">
                      {idx + 1}
                    </span>
                  )}

                  <div className={`relative ${showRanking ? "z-20" : ""}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="rounded-lg shadow-md group-hover:scale-105 transition-transform duration-200 w-full h-72 object-cover"
                    />

                    <span className="absolute top-2 right-2 bg-zinc-900/80 text-yellow-400 text-xs px-2 py-1 rounded font-bold">
                      ★ {movie.vote_average.toFixed(1)}
                    </span>

                    {showRanking && idx < 3 && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
                        Recently Added
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-center text-sm font-medium truncate" title={movie.title}>
                    {movie.title}
                  </p>
                </Link>
              ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  )
}

export default MovieRow
