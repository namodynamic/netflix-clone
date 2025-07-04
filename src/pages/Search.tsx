"use client";

import { useState, useEffect, useCallback } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { searchMulti, searchMovies, searchTVShows } from "../api/tmdb"
import { Plus, Check, Star, Calendar, Film, Tv } from "lucide-react"
import { useMyList } from "../contexts/useMyList";
import type { SearchResponse, SearchResult } from "../types";


type FilterType = 'all' | 'movie' | 'tv'
type SortType = 'relevance' | 'rating' | 'date' | 'popularity'

const Search = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Get search query from URL params
  const getSearchQuery = () => {
    const params = new URLSearchParams(location.search)
    return params.get('q') || ''
  }
  
  const [searchQuery, setSearchQuery] = useState(() => getSearchQuery())
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("relevance");
  const { addToMyList, removeFromMyList, isInMyList } = useMyList();
  
  // Update search query, filter, and sort when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const newQuery = params.get('q') || ''
    const newFilter = (params.get('filter') as FilterType) || 'all'
    const newSort = (params.get('sort') as SortType) || 'relevance'
    
    setSearchQuery(newQuery)
    setFilter(newFilter)
    setSortBy(newSort)
  }, [location.search])

  const performSearch = useCallback(
    async (query: string, page: number = 1) => {
      if (!query.trim()) {
        setResults([]);
        setTotalResults(0);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let searchResponse: SearchResponse;

        if (filter === "movie") {
          searchResponse = await searchMovies(query, page);
        } else if (filter === "tv") {
          searchResponse = await searchTVShows(query, page);
        } else {
          searchResponse = await searchMulti(query, page);
        }

        // Filter out person results for multi search
        const filteredResults = searchResponse.results.filter(
          (item: SearchResult) =>
            item.media_type !== "person" && item.poster_path
        );

        // Sort results
        const sortedResults = sortResults(filteredResults, sortBy);

        if (page === 1) {
          setResults(sortedResults);
        } else {
          setResults((prev) => [...prev, ...sortedResults]);
        }

        setTotalResults(searchResponse.total_results);
        setTotalPages(searchResponse.total_pages);
        setCurrentPage(page);
      } catch (err) {
        setError("Failed to search. Please try again.");
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    },
    [filter, sortBy]
  );

  const sortResults = (results: SearchResult[], sortType: SortType) => {
    return [...results].sort((a, b) => {
      switch (sortType) {
        case "rating":
          return b.vote_average - a.vote_average;
        case "date": {
          const dateA = new Date(
            a.release_date || a.first_air_date || "1900-01-01"
          );
          const dateB = new Date(
            b.release_date || b.first_air_date || "1900-01-01"
          );
          return dateB.getTime() - dateA.getTime();
        }
        case "popularity":
          return b.vote_average * 10 - a.vote_average * 10; // Using vote_average as popularity proxy
        case "relevance":
        default:
          return 0; // Keep original order for relevance
      }
    });
  };

  // Debounce search to avoid too many API calls
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      performSearch(searchQuery, 1);
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]);

  const getDisplayTitle = (item: SearchResult) =>
    item.title || item.name || "Unknown Title";
  const getDisplayDate = (item: SearchResult) =>
    item.release_date || item.first_air_date;
  const getItemType = (item: SearchResult) => {
    if (item.media_type) return item.media_type;
    return item.title ? "movie" : "tv";
  };
  const getImageUrl = (path: string | null) => {
    if (!path) return "/placeholder.svg";
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  const handleAddToList = (item: SearchResult) => {
    const itemType = getItemType(item);
    addToMyList({
      id: item.id,
      title: item.title,
      name: item.name,
      poster_path: item.poster_path || "",
      backdrop_path: item.backdrop_path ?? "",
      vote_average: item.vote_average,
      release_date: item.release_date,
      first_air_date: item.first_air_date,
      overview: item.overview,
      type: itemType as "movie" | "tv",
      genre_ids: item.genre_ids,
    });
  };

  const loadMore = () => {
    if (currentPage < totalPages && !loading) {
      performSearch(searchQuery, currentPage + 1);
    }
  };

  if (!searchQuery.trim()) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white pt-24 px-8">
        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
              <Film size={40} className="text-gray-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Search</h1>
            <p className="text-gray-400 text-lg">
              Discover your next favorite movie or TV show
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <Film className="text-red-600 mb-3" size={24} />
              <h3 className="font-semibold mb-2">Movies</h3>
              <p className="text-gray-400 text-sm">
                Search through thousands of movies
              </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <Tv className="text-red-600 mb-3" size={24} />
              <h3 className="font-semibold mb-2">TV Shows</h3>
              <p className="text-gray-400 text-sm">
                Find your next binge-worthy series
              </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <Star className="text-red-600 mb-3" size={24} />
              <h3 className="font-semibold mb-2">Highly Rated</h3>
              <p className="text-gray-400 text-sm">
                Discover critically acclaimed content
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white pt-24 px-8">
     
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-gray-400">
          {loading && currentPage === 1
            ? "Searching..."
            : `${totalResults.toLocaleString()} results for "${searchQuery}"`}
        </p>
      </div>

      {/* Filters and Sort */}
      {(results.length > 0 || loading) && (
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <select
            value={filter}
            onChange={(e) => {
              const newFilter = e.target.value as FilterType
              setFilter(newFilter)
              setCurrentPage(1)
              
              // Update URL with filter param
              const params = new URLSearchParams(location.search)
              if (newFilter !== 'all') {
                params.set('filter', newFilter)
              } else {
                params.delete('filter')
              }
              navigate(`/search?${params.toString()}`, { replace: true })
            }}
            className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:border-red-600 focus:outline-none"
          >
            <option value="all">All Content</option>
            <option value="movie">Movies</option>
            <option value="tv">TV Shows</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => {
              const newSort = e.target.value as SortType
              setSortBy(newSort)
              setCurrentPage(1)
              
              // Update URL with sort param
              const params = new URLSearchParams(location.search)
              if (newSort !== 'relevance') {
                params.set('sort', newSort)
              } else {
                params.delete('sort')
              }
              navigate(`/search?${params.toString()}`, { replace: true })
            }}
            className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:border-red-600 focus:outline-none"
          >
            <option value="relevance">Most Relevant</option>
            <option value="rating">Highest Rated</option>
            <option value="date">Newest First</option>
            <option value="popularity">Most Popular</option>
          </select>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-600/20 border border-red-600 text-red-400 px-4 py-3 rounded mb-8">
          <p>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && currentPage === 1 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-zinc-800 rounded-lg h-80"
            />
          ))}
        </div>
      ) : (
        <>
          {/* Results Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((item) => {
              const itemType = getItemType(item);
              const displayTitle = getDisplayTitle(item);
              const displayDate = getDisplayDate(item);

              return (
                <div key={item.id} className="group relative">
                  <Link to={`/${itemType}/${item.id}`}>
                    <img
                      src={getImageUrl(item.poster_path)}
                      alt={displayTitle}
                      className="w-full h-72 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                    />

                    {/* Content Type Badge */}
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      {itemType === "movie" ? (
                        <Film size={12} />
                      ) : (
                        <Tv size={12} />
                      )}
                      {itemType === "movie" ? "Movie" : "TV"}
                    </div>
                  </Link>

                  {/* Add to List Button */}
                  <button
                    onClick={() => {
                      if (isInMyList(item.id)) {
                        removeFromMyList(item.id);
                      } else {
                        handleAddToList(item);
                      }
                    }}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity ${
                      isInMyList(item.id)
                        ? "bg-white text-black"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                    title={
                      isInMyList(item.id)
                        ? "Remove from My List"
                        : "Add to My List"
                    }
                  >
                    {isInMyList(item.id) ? (
                      <Check size={14} />
                    ) : (
                      <Plus size={14} />
                    )}
                  </button>

                  {/* Info */}
                  <div className="mt-2">
                    <p className="text-sm font-medium truncate">
                      {displayTitle}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-400" />
                        {item.vote_average.toFixed(1)}
                      </span>
                      {displayDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(displayDate).getFullYear()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          {currentPage < totalPages && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded font-medium transition-colors"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}

      {/* No Results */}
      {!loading && results.length === 0 && !error && (
        <div className="text-center py-16">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
              <Film size={40} className="text-gray-600" />
            </div>
            <p className="text-xl text-gray-400 mb-2">
              No results found for "{searchQuery}"
            </p>
            <p className="text-gray-500">
              Try different keywords or browse our categories
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/movies"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors"
            >
              Browse Movies
            </Link>
            <Link
              to="/tv-shows"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium transition-colors"
            >
              Browse TV Shows
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
