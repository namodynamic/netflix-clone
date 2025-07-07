"use client";

import { useState, useEffect, useRef } from "react";
import {
  fetchMovieDetail,
  fetchMovieVideos,
  fetchTVShowDetail,
  fetchTVShowVideos,
} from "../api/tmdb";
import {
  Play,
  Info,
  Volume2,
  VolumeX,
  Image,
  Clapperboard,
} from "lucide-react";
import { Link } from "react-router-dom";
import YouTube from "react-youtube";
import type { YouTubePlayer } from "react-youtube";
import type { Movie, Video } from "../types";

interface HeroProps {
  mediaId: number;
  mediaType: "movie" | "tv";
}

const Hero = ({ mediaId, mediaType }: HeroProps) => {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [media, setMedia] = useState<Movie | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        let mediaData;
        let videos;

        if (mediaType === "movie") {
          mediaData = await fetchMovieDetail(String(mediaId));
          videos = await fetchMovieVideos(String(mediaId));
        } else {
          mediaData = await fetchTVShowDetail(String(mediaId));
          videos = await fetchTVShowVideos(String(mediaId));
        }

        setMedia(mediaData);
        const trailer = videos.find(
          (v: Video) => v.site === "YouTube" && v.type === "Trailer"
        );
        setTrailerKey(trailer?.key ?? null);
      } catch (err) {
        console.error("Failed to fetch hero content", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [mediaId, mediaType]);

  useEffect(() => {
    if (trailerKey === null) {
      setShowVideo(false);
      return;
    }

    const timeout = setTimeout(() => {
      if (!videoReady) {
        setShowVideo(false);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [trailerKey, videoReady]);

  useEffect(() => {
    setVideoReady(false);
    setShowVideo(true);
  }, [mediaId, mediaType]);

  useEffect(() => {
    if (playerRef.current) {
      if (showVideo) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [showVideo]);

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

  const toggleVideoDisplay = () => {
    if (showVideo) {
      setShowVideo(false);
    } else if (trailerKey) {
      setShowVideo(true);
      if (playerRef.current) {
        playerRef.current.playVideo();
      }
    }
  };

  if (isLoading || !media) {
    return (
      <section className="relative h-screen bg-zinc-950 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 to-zinc-800" />
      </section>
    );
  }

  return (
    <section className="relative h-[60vw] bg-zinc-950 z-0">
      <div className="absolute inset-0">
        {trailerKey && (
          <YouTube
            videoId={trailerKey}
            iframeClassName={`absolute inset-0 w-full h-full -top-10 scale-120 lg:-top-20 object-cover transition-opacity duration-300 ${
              showVideo ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
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
            onReady={(event) => {
              playerRef.current = event.target;
              setVideoReady(true);
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
            onError={(e) => {
              console.error("YouTube player error", e.data);
              setShowVideo(false);
            }}
          />
        )}

        <img
          src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
          alt={media.title || media.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            showVideo ? "opacity-0 invisible" : "opacity-100 visible"
          }`}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
      </div>

      <div className="relative z-20 top-40 lg:top-0 flex items-center h-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl lg:max-w-3xl">
            <div className="mb-4">
              <span className="inline-flex items-center bg-red-600 text-white px-3 py-1.5 text-xs sm:text-sm font-bold rounded-md shadow-lg">
                <span className="mr-1">N</span>
                {mediaType === "movie" ? "FILM" : "SERIES"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight text-white drop-shadow-2xl">
              {mediaType === "movie" ? media.title : media.name}
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 text-gray-100 leading-relaxed max-w-xl lg:max-w-2xl line-clamp-3 drop-shadow-lg">
              {media.overview}
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 text-xs sm:text-sm">
              <span className="text-green-400 font-bold">
                {Math.round(media.vote_average * 10)}% Match
              </span>
              <span className="border border-gray-400/60 bg-black/30 px-2 py-1 rounded text-gray-200">
                {(media.release_date || media.first_air_date)?.split("-")[0]}
              </span>
              <span className="border border-gray-400/60 bg-black/30 px-2 py-1 rounded text-gray-200">
                HD
              </span>
              <span className="border border-gray-400/60 bg-black/30 px-2 py-1 rounded text-gray-200">
                18+
              </span>
            </div>

            <div className="flex flex-row items-stretch sm:items-center space-x-4 mb-10 pb-8">
              <button className="flex items-center justify-center space-x-2 bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                <Play size={20} fill="currentColor" />
                <span className="text-sm sm:text-base">Play</span>
              </button>

              <Link
                to={`/${mediaType}/${mediaId}`}
                className="flex items-center justify-center space-x-2 bg-gray-600/80 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Info size={20} />
                <span className="text-sm sm:text-base">More Info</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 sm:bottom-40 lg:bottom-70 right-4 sm:right-6 lg:right-8 z-30 flex flex-col sm:flex-row gap-2 sm:gap-3">
        {trailerKey && (
          <button
            onClick={toggleVideoDisplay}
            className="p-3 sm:p-4 bg-black/50 backdrop-blur-sm border border-gray-600/50 rounded-full hover:bg-black/80 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
            title={showVideo ? "Show Image" : "Show Video"}
          >
            {showVideo ? <Clapperboard size={20} /> : <Image size={20} />}
          </button>
        )}

        {trailerKey && showVideo && (
          <button
            onClick={toggleMute}
            className="p-3 sm:p-4 bg-black/50 backdrop-blur-sm border border-gray-600/50 rounded-full hover:bg-black/80 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        )}
      </div>
    </section>
  );
};

export default Hero;
