"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Play,
  Plus,
  Check,
  ThumbsUp,
  ThumbsDown,
  Share,
  ArrowLeft,
  VolumeX,
  Volume2,
} from "lucide-react";
import {
  fetchMovieCredits,
  fetchMovieDetail,
  fetchMovieVideos,
  fetchSimilarMovies,
} from "../api/tmdb";
import { useMyList } from "../contexts/useMyList";
import YouTube from "react-youtube";
import type { YouTubePlayer } from "react-youtube";
import type { MovieDetailType, Video } from "../types";
import { Link } from "react-router-dom";

interface CrewMember {
  job: string;
  name: string;
}

interface CastMember {
  name: string;
}

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const playerRef = useRef<YouTubePlayer | null>(null);
  const { addToMyList, removeFromMyList, isInMyList } = useMyList();
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [similarMovies, setSimilarMovies] = useState<MovieDetailType[]>([]);
  const [director, setDirector] = useState<string | null>(null);
  const [cast, setCast] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      fetchMovieDetail(id)
        .then((data) => setMovie(data))
        .finally(() => setLoading(false));

      fetchMovieVideos(id).then((videos) => {
        const trailer = videos.find(
          (v: Video) => v.site === "YouTube" && v.type === "Trailer"
        );
        setTrailerKey(trailer ? trailer.key : null);
      });

      fetchSimilarMovies(id).then((data) => {
        setSimilarMovies(data.slice(0, 6));
      });

      fetchMovieCredits(id).then((credits) => {
        const directorObj = credits.crew.find(
          (c: CrewMember) => c.job === "Director"
        );
        setDirector(directorObj ? directorObj.name : null);

        setCast(credits.cast.slice(0, 10).map((c: CastMember) => c.name));
      });
    }
  }, [id]);

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

  if (loading)
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        Loading...
      </div>
    );
  if (!movie) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">Movie not found</div>
      </div>
    );
  }

  const handleAddToMyList = () => {
    if (!movie) return;

    if (isInMyList(movie.id)) {
      removeFromMyList(movie.id);
    } else {
      addToMyList({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        overview: movie.overview,
        type: "movie",
        genre_ids: movie.genres?.map((g) => g.id) || [],
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      <div className="relative">
        <button
          onClick={() => navigate(-1)}
          className="fixed top-20 left-4 z-20 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="h-[60vw] md:h-[500px] z-0">
          {trailerKey ? (
            <div className="aspect-video w-full lg:-top-30 absolute">
              <YouTube
                videoId={trailerKey}
                iframeClassName="aspect-video w-full h-full"
                opts={{
                  playerVars: {
                    autoplay: 1,
                    controls: 0,
                    loop: 1,
                    playlist: trailerKey,
                    rel: 0,
                    showinfo: 0,
                    modestbranding: 1,
                    disablekb: 1,
                  },
                }}
                title="Trailer Video"
                onReady={(event) => {
                  playerRef.current = event.target;
                  if (isMuted) {
                    event.target.mute();
                  } else {
                    event.target.unMute();
                  }
                }}
                onEnd={() => {
                  playerRef.current?.seekTo(0);
                  playerRef.current?.playVideo();
                }}
              />
            </div>
          ) : (
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
        </div>

        <div className="relative -mt-5 z-10 px-8">
          <div className="flex flex-col-reverse md:flex-row gap-8">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="md:w-64 w-full h-96 object-cover  rounded-lg shadow-lg"
            />

            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {movie.title}
              </h1>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-green-400 font-bold text-lg">
                  {Math.round(movie.vote_average * 10)}% Match
                </span>
                <span className="text-gray-300">
                  {movie.release_date?.split("-")[0]}
                </span>
                <span className="border border-gray-400 px-2 py-1 text-sm">
                  HD
                </span>
                <span className="border border-gray-400 px-2 py-1 text-sm">
                  18+
                </span>
              </div>

              <div className="flex items-center space-x-2 md:space-x-4 mb-6">
                <button className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200 transition-colors">
                  <Play size={20} fill="currentColor" />
                  <span>Play</span>
                </button>

                <button
                  onClick={handleAddToMyList}
                  className={`p-3 rounded-full border-2 transition-colors ${
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
                    <Check size={20} />
                  ) : (
                    <Plus size={20} />
                  )}
                </button>

                <button className="p-3 rounded-full border-2 border-gray-400 hover:border-white transition-colors">
                  <ThumbsUp size={20} />
                </button>

                <button className="p-3 rounded-full border-2 border-gray-400 hover:border-white transition-colors">
                  <ThumbsDown size={20} />
                </button>

                <button className="p-3 rounded-full border-2 border-gray-400 hover:border-white transition-colors">
                  <Share size={20} />
                </button>
              </div>

              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                {movie.overview}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Genres: </span>
                  <span>
                    {movie.genres && movie.genres.length > 0
                      ? movie.genres.map((g) => g.name).join(", ")
                      : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Rating: </span>
                  <span>★ {movie.vote_average.toFixed(1)}/10</span>
                </div>
                <div>
                  <span className="text-gray-400">Director: </span>
                  <span>{director || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-400">Cast: </span>
                  <span>{cast.length > 0 ? cast.join(", ") : "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute z-10 top-20 md:top-50 lg:top-120 right-4 md:right-8 flex gap-2">
        {trailerKey && (
          <button
            onClick={toggleMute}
            className="p-2 bg-black/50 border border-gray-600 rounded-full hover:bg-black/70 transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX /> : <Volume2 />}
          </button>
        )}
      </div>

      <div className="px-8 mt-16 mb-8 top-10 bg-zinc-950">
        <h2 className="text-2xl font-bold mb-6">More Like This</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {similarMovies.map((similarMovie) => (
            <Link
              key={similarMovie.id}
              to={`/movie/${similarMovie.id}`}
              className="group"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${similarMovie.poster_path}`}
                alt={similarMovie.title}
                className="w-full h-64 object-fill rounded-lg group-hover:scale-105 transition-transform duration-200"
              />
              <p className="mt-2 text-sm font-medium truncate">
                {similarMovie.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
