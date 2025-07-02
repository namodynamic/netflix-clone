"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { mockMovies } from "../data/Mockdata"

const MyList = () => {
  const [myList, setMyList] = useState(mockMovies.slice(0, 8))

  const removeFromList = (id: number) => {
    setMyList((prev) => prev.filter((movie) => movie.id !== id))
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white pt-24 px-8">
      <h1 className="text-4xl font-bold mb-8">My List</h1>

      {myList.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-400 mb-4">Your list is empty</p>
          <p className="text-gray-500">Add movies and shows you want to watch later</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {myList.map((movie) => (
            <div key={movie.id} className="group relative">
              <Link to={`/movie/${movie.id}`}>
                <img
                  src={movie.poster_path || "/placeholder.svg"}
                  alt={movie.title}
                  className="w-full h-72 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                />
              </Link>

              <button
                onClick={() => removeFromList(movie.id)}
                className="absolute top-2 right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>

              <p className="mt-2 text-sm font-medium truncate">{movie.title}</p>
              <p className="text-xs text-gray-400">★ {movie.vote_average.toFixed(1)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyList
