"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import MovieCard from "./MovieCard"
import type { Movie } from "../types"

interface MovieRowProps {
  title: string
  movies: Movie[]
  showRanking?: boolean
  loading?: boolean
  recentlyAddedIds?: number[]
  top10Ids?: number[]
}

const SkeletonCard = () => <div className="animate-pulse bg-zinc-900 rounded-lg h-72 w-full min-w-[180px]" />

const MovieRow = ({
  title,
  movies,
  showRanking = false,
  loading = false,
  recentlyAddedIds,
  top10Ids,
}: MovieRowProps) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [hoveredMovieId, setHoveredMovieId] = useState<number | null>(null)
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
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 px-8 sm:mb-6 text-white">{title}</h2>

      <div className="relative group">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 p-2 rounded-full"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4 px-8 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            : movies.map((movie, idx) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  index={idx}
                  showRanking={showRanking}
                  isRecentlyAdded={recentlyAddedIds?.includes(movie.id)}
                  isTop10={top10Ids?.includes(movie.id)}
                  onHover={setHoveredMovieId}
                  isHovered={hoveredMovieId === movie.id}
                />
              ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 p-2 rounded-full"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  )
}

export default MovieRow
