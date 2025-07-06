"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Grid, List, Trash2, Calendar, Star } from "lucide-react";
import { useMyList } from "../contexts/useMyList";

interface Item {
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
}

const MyList = () => {
  const { myList, removeFromMyList, clearMyList } = useMyList();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState<"all" | "movie" | "tv">("all");
  const [sortBy, setSortBy] = useState<"dateAdded" | "title" | "rating">(
    "dateAdded"
  );

  // Filter and sort the list
  const filteredAndSortedList = myList
    .filter((item) => filterType === "all" || item.type === filterType)
    .sort((a, b) => {
      switch (sortBy) {
        case "title": {
          const titleA = a.title || a.name || "";
          const titleB = b.title || b.name || "";
          return titleA.localeCompare(titleB);
        }
        case "rating":
          return b.vote_average - a.vote_average;
        case "dateAdded":
        default:
          return 0;
      }
    });

  const getDisplayTitle = (item: Item) =>
    item.title || item.name || "Unknown Title";
  const getDisplayDate = (item: Item) =>
    item.release_date || item.first_air_date || "";
  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.svg";
    if (path.startsWith("http")) return path;
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-24 px-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My List</h1>
          <p className="text-gray-400">
            {myList.length} {myList.length === 1 ? "item" : "items"} in your
            list
          </p>
        </div>

        {myList.length > 0 && (
          <div className="flex flex-wrap sm:flex-row gap-4 mt-4 lg:mt-0">
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-red-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-red-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <List size={20} />
              </button>
            </div>

            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as "all" | "movie" | "tv")
              }
              className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:border-red-600 focus:outline-none"
            >
              <option value="all">All Items</option>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "dateAdded" | "title" | "rating")
              }
              className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:border-red-600 focus:outline-none"
            >
              <option value="dateAdded">Date Added</option>
              <option value="title">Title A-Z</option>
              <option value="rating">Rating</option>
            </select>

            {/* Clear All */}
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to clear your entire list?"
                  )
                ) {
                  clearMyList();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          </div>
        )}
      </div>

      {myList.length === 0 ? (
        <div className="text-center py-16">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
              <List size={40} className="text-gray-600" />
            </div>
            <p className="text-xl text-gray-400 mb-4">Your list is empty</p>
            <p className="text-gray-500 mb-8">
              Add movies and shows you want to watch later
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors"
            >
              Browse Content
            </Link>
          </div>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
              : "space-y-4"
          }
        >
          {filteredAndSortedList.map((item) =>
            viewMode === "grid" ? (
              <div key={item.id} className="group relative">
                <Link to={`/${item.type}/${item.id}`}>
                  <img
                    src={getImageUrl(item.poster_path)}
                    alt={getDisplayTitle(item)}
                    className="w-full h-72 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                  />
                </Link>

                <button
                  onClick={() => removeFromMyList(item.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                  title="Remove from list"
                >
                  ✕
                </button>

                <div className="mt-2">
                  <p className="text-sm font-medium truncate">
                    {getDisplayTitle(item)}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-400" />
                      {item.vote_average.toFixed(1)}
                    </span>
                    <span className="capitalize text-gray-500">
                      {item.type}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group"
              >
                <Link to={`/${item.type}/${item.id}`} className="flex-shrink-0">
                  <img
                    src={getImageUrl(item.poster_path)}
                    alt={getDisplayTitle(item)}
                    className="w-24 h-36 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <Link to={`/${item.type}/${item.id}`}>
                        <h3 className="text-lg font-bold truncate hover:text-red-400 transition-colors">
                          {getDisplayTitle(item)}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-400" />
                          {item.vote_average.toFixed(1)}
                        </span>
                        <span className="capitalize">{item.type}</span>
                        {getDisplayDate(item) && (
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(getDisplayDate(item)).getFullYear()}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromMyList(item.id)}
                      className="ml-4 p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                      title="Remove from list"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                    {item.overview}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default MyList;
