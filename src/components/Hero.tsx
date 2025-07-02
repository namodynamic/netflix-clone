"use client";

import { useState, useEffect } from "react";
import { fetchMovieDetail, fetchMovieVideos } from "../api/tmdb";
import {
  Play,
  Info,
  Volume2,
  VolumeX,
  Image,
  Clapperboard,
} from "lucide-react";
import { Link } from "react-router-dom";

interface HeroProps {
  movieId: number;
}

interface Movie {
  title: string;
  overview: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
}

interface Video {
  site: string;
  type: string;
  key: string;
}

const Hero = ({ movieId }: HeroProps) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(true);

  useEffect(() => {
    fetchMovieDetail(String(movieId)).then(setMovie);
    fetchMovieVideos(String(movieId)).then((videos) => {
      const trailer = videos.find(
        (v: Video) => v.site === "YouTube" && v.type === "Trailer"
      );
      setTrailerKey(trailer ? trailer.key : null);
    });
  }, [movieId]);

  if (!movie) return null;

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideoDisplay = () => {
    setShowVideo(!showVideo);
  };

  return (
    <section className="relative h-screen">
      <div className="absolute inset-0">
        {trailerKey && showVideo ? (
          <iframe
            className="absolute inset-0 w-full h-full -top-20 object-cover z-0"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${
              isMuted ? 1 : 0
            }&controls=0&loop=1&playlist=${trailerKey}&rel=0&showinfo=0&modestbranding=1`}
            title="Movie Trailer"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex items-center h-full px-8 md:px-16">
        <div className="max-w-2xl">
          <div className="mb-4">
            <span className="bg-red-600 text-white px-2 py-1 text-sm font-bold rounded">
              N SERIES
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            {movie.title}
          </h1>

          <p className="text-lg md:text-xl mb-6 text-gray-200 leading-relaxed max-w-xl line-clamp-3">
            {movie.overview}
          </p>

          <div className="flex items-center space-x-4 mb-8">
            <span className="text-green-400 font-bold">
              {Math.round(movie.vote_average * 10)}% Match
            </span>
            <span className="border border-gray-400 px-2 py-1 text-sm">
              {movie.release_date?.split("-")[0]}
            </span>
            <span className="border border-gray-400 px-2 py-1 text-sm">HD</span>
          </div>

          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded font-bold hover:bg-gray-200 transition-colors">
              <Play size={20} fill="currentColor" />
              <span>Play</span>
            </button>

            <Link to={`/movie/${movieId}`} className="flex items-center space-x-2 bg-gray-600/70 text-white px-6 py-3 rounded font-bold hover:bg-gray-600/90 transition-colors">
              <Info size={20} />
              <span>More Info</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute z-50 bottom-56 right-4 md:right-8 flex gap-2">
        {trailerKey && (
          <button
            onClick={toggleVideoDisplay}
            className="p-2 bg-black/50 border border-gray-600 rounded-full hover:bg-black/70 transition-colors"
            title={showVideo ? "Show Image" : "Show Video"}
          >
            {showVideo ? <Clapperboard /> : <Image />}
          </button>
        )}

        {trailerKey && showVideo && (
          <button
            onClick={toggleMute}
            className="p-2 bg-black/50 border border-gray-600 rounded-full hover:bg-black/70 transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX /> : <Volume2 />}
          </button>
        )}
      </div>
    </section>
  );
};

export default Hero;
