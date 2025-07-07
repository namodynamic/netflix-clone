"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Plus,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  Check,
  VolumeX,
  Volume2,
} from "lucide-react";
import YouTube from "react-youtube";
import type { YouTubePlayer } from "react-youtube";
import type { Movie, Video } from "../types";
import { fetchMovieVideos, fetchTVShowVideos } from "../api/tmdb";
import { useMyList } from "../contexts/useMyList";

interface MovieCardProps {
  movie: Movie;
  index: number;
  showRanking?: boolean;
  isRecentlyAdded?: boolean;
  isTop10?: boolean;
  onHover?: (movieId: number | null) => void;
  isHovered?: boolean;
}

const genreMap: { [key: number]: string } = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

const MovieCard = ({
  movie,
  index,
  showRanking,
  isRecentlyAdded,
  isTop10,
  onHover,
}: MovieCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const videoTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const { addToMyList, removeFromMyList, isInMyList } = useMyList();

  const movieTitle = movie.title || movie.name || "Unknown Title";
  const releaseYear =
    movie.release_date?.split("-")[0] ||
    movie.first_air_date?.split("-")[0] ||
    "N/A";
  const isTV = !!movie.name;
  const genres =
    movie.genre_ids
      ?.slice(0, 3)
      .map((id) => genreMap[id])
      .filter(Boolean) || [];

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const videos = isTV
          ? await fetchTVShowVideos(movie.id.toString())
          : await fetchMovieVideos(movie.id.toString());

        const trailer = videos.find(
          (video: Video) => video.site === "YouTube" && video.type === "Trailer"
        );

        if (trailer) {
          setTrailerKey(trailer.key);
        }
      } catch (error) {
        console.error("Error fetching trailer:", error);
      }
    };

    fetchTrailer();
  }, [movie.id, isTV]);

  useEffect(() => {
    if (isHovering) {
      hoverTimeoutRef.current = setTimeout(() => {
        setShowPreview(true);
        onHover?.(movie.id);

        // Start video after additional delay if trailer is available
        if (trailerKey) {
          videoTimeoutRef.current = setTimeout(() => {
            setShowVideo(true);
          }, 1000);
        }
      }, 500);
    } else {
      // Clear timeouts
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (videoTimeoutRef.current) {
        clearTimeout(videoTimeoutRef.current);
      }

      setShowPreview(false);
      setShowVideo(false);
      setIsVideoLoaded(false);
      onHover?.(null);
    }

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (videoTimeoutRef.current) {
        clearTimeout(videoTimeoutRef.current);
      }
    };
  }, [isHovering, movie.id, onHover, trailerKey]);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      if (playerRef.current) {
        if (newMuted) {
          playerRef.current.mute();
        } else {
          playerRef.current.unMute();
        }
      }
      return newMuted;
    });
  };

  const handleAddToMyList = () => {
    if (!movie) return;
    const type = movie.name ? "tv" : "movie";

    if (isInMyList(movie.id)) {
      removeFromMyList(movie.id);
    } else {
      addToMyList({
        id: movie.id,
        title: movie.title,
        name: movie.name,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        overview: movie.overview,
        type,
      });
    }
  };

  return (
    <div
      ref={cardRef}
      className={`group block min-w-[300px] transition-all duration-300 ${
        showPreview ? "z-100" : "z-50"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      {/* Card */}
      <div
        className={`relative ${
          showRanking ? "z-10" : ""
        } transition-all duration-300`}
      >
        <Link to={isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movieTitle}
            className={`rounded-lg shadow-md w-full h-42 object-fill transition-all duration-200 ${
              showPreview ? "opacity-0" : "opacity-100 hover:scale-100"
            }`}
          />
        </Link>

        <span className="absolute bottom-0 right-0 text-zinc-100/70 text-xs px-2 py-1 rounded font-bold">
          ★ {movie.vote_average.toFixed(1)}
        </span>

        {isRecentlyAdded && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
            Recently Added
          </span>
        )}

        {isTop10 && (
          <span className="absolute top-0 -left-1 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold shadow">
            Top 10
          </span>
        )}

         {showRanking && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[9rem] font-extrabold text-zinc-400 opacity-60 select-none z-50 pointer-events-none">
          {index + 1}
        </span>
      )}
      </div>

      {/* Preview Card */}
      {showPreview && (
        <div
          className="absolute top-0 w-fit md:w-90 bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-700 overflow-hidden transform -translate-y-16 z-[999] animate-in fade-in slide-in-from-bottom-4 duration-300"
          title={movieTitle}
        >
          <div className="relative h-full">
            {showVideo && trailerKey ? (
              <YouTube
                iframeClassName="aspect-video w-full h-full"
                videoId={trailerKey}
                opts={{
                  playerVars: {
                    autoplay: 1,
                    controls: 0,
                    loop: 1,
                    playlist: trailerKey,
                    showinfo: 0,
                    modestbranding: 1,
                    rel: 0,
                    mute: 1,
                  },
                }}
                onReady={(event: { target: YouTubePlayer }) => {
                  playerRef.current = event.target;
                  setIsVideoLoaded(true);
                  event.target.mute();
                  event.target.playVideo();
                }}
              />
            ) : movie.backdrop_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                alt={movieTitle}
                className="w-full h-full object-fill"
              />
            ) : (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movieTitle}
                className="w-full h-full object-cover"
              />
            )}

            {!showVideo && (
              <Link
                to={isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`}
                className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              >
                <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Play
                    size={20}
                    className="text-white ml-1"
                    fill="currentColor"
                  />
                </button>
              </Link>
            )}

            {showVideo && isVideoLoaded && (
              <button
                onClick={toggleMute}
                className="absolute bottom-8 right-5 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                {isMuted ? (
                  <VolumeX size={16} className="text-white" />
                ) : (
                  <Volume2 size={16} className="text-white" />
                )}
              </button>
            )}

            {isRecentlyAdded && (
              <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
                Recently Added
              </span>
            )}

            {isTop10 && (
              <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
                Top 10
              </span>
            )}
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Link
                  to={isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <Play
                    size={16}
                    className="text-black ml-0.5"
                    fill="currentColor"
                  />
                </Link>

                <button
                  onClick={handleAddToMyList}
                  className={`w-8 h-8 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition-colors ${
                    movie && isInMyList(movie.id)
                      ? "bg-white text-black border-white"
                      : "border-gray-400 hover:border-white"
                  }`}
                  title={
                    movie && isInMyList(movie.id)
                      ? "Remove from My List"
                      : "Add to My List"
                  }
                >
                  {movie && isInMyList(movie.id) ? (
                    <Check size={16} />
                  ) : (
                    <Plus size={16} />
                  )}
                </button>

                <button className="w-8 h-8 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition-colors">
                  <ThumbsUp size={14} className="text-white" />
                </button>

                <button className="w-8 h-8 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition-colors">
                  <ThumbsDown size={14} className="text-white" />
                </button>
              </div>

              <Link
                to={isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`}
                className="w-8 h-8 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition-colors"
                title="More Info"
              >
                <ChevronDown size={16} className="text-white" />
              </Link>
            </div>

            <div className="flex items-center space-x-2 mb-2 text-xs">
              <span className="text-green-400 font-bold">
                {Math.round(movie.vote_average * 10)}% Match
              </span>
              <span className="border border-gray-500 px-1 py-0.5 text-gray-300">
                16+
              </span>
              <span className="text-gray-300">{releaseYear}</span>
              <span className="border border-gray-500 px-1 py-0.5 text-gray-300">
                HD
              </span>
            </div>

            {genres.length > 0 && (
              <div className="flex flex-wrap gap-1 text-xs text-gray-300">
                {genres.map((genre, idx) => (
                  <span key={genre}>
                    {genre}
                    {idx < genres.length - 1 && <span className="mx-1">•</span>}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
