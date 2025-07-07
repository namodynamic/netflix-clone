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
  Calendar,
  Star,
  VolumeX,
  Volume2,
} from "lucide-react";
import {
  fetchSeasonEpisodes,
  fetchTVShowDetail,
  fetchTVShowVideos,
} from "../api/tmdb";
import type { Episode, Season, TVShow, Video } from "../types";
import { useMyList } from "../contexts/useMyList";
import YouTube from "react-youtube";
import type { YouTubePlayer } from "react-youtube";

const TVShowDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const playerRef = useRef<YouTubePlayer | null>(null);
  const { addToMyList, removeFromMyList, isInMyList } = useMyList();
  const [loading, setLoading] = useState(true);
  const [tvShow, setTVShow] = useState<TVShow | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [episodes, setEpisodes] = useState<Episode[] | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [activeTab, setActiveTab] = useState<"episodes" | "details">(
    "episodes"
  );

  useEffect(() => {
    if (id) {
      fetchTVShowDetail(id)
        .then((data) => {
          setTVShow(data);
          if (data.seasons && data.seasons.length > 0) {
            const firstSeason = data.seasons[0];
            setSelectedSeason(firstSeason);
          }
        })
        .finally(() => setLoading(false));

      fetchTVShowVideos(id).then((videos) => {
        const trailer = videos.find(
          (v: Video) => v.site === "YouTube" && v.type === "Trailer"
        );
        setTrailerKey(trailer ? trailer.key : null);
      });
    }
  }, [id]);

  useEffect(() => {
    if (tvShow && selectedSeason) {
      fetchSeasonEpisodes(tvShow.id, selectedSeason.season_number).then(
        setEpisodes
      );
    }
  }, [tvShow, selectedSeason]);

  if (loading)
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        Loading...
      </div>
    );

  if (!tvShow) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white text-xl">TV Show not found</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "returning series":
        return "text-green-400";
      case "ended":
        return "text-red-400";
      case "canceled":
        return "text-red-500";
      default:
        return "text-yellow-400";
    }
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
    if (!tvShow) return;

    if (isInMyList(tvShow.id)) {
      removeFromMyList(tvShow.id);
    } else {
      addToMyList({
        id: tvShow.id,
        name: tvShow.name,
        poster_path: tvShow.poster_path,
        backdrop_path: tvShow.backdrop_path,
        vote_average: tvShow.vote_average,
        first_air_date: tvShow.first_air_date,
        overview: tvShow.overview,
        type: "tv",
        genre_ids: tvShow.genres?.map((g) => g.id) || [],
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="relative">
        <button
          onClick={() => navigate(-1)}
          className="fixed top-20 left-4 z-20 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="h-[60vw] md:h-[500px] z-0">
          {trailerKey ? (
            <div className="aspect-video w-full lg:-top-40 absolute">
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
              src={`https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`}
              alt={tvShow.name}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
        </div>

        <div className="relative -mt-16 z-10 px-8">
          <div className="flex flex-col-reverse lg:flex-row gap-8">
            <img
              src={`https://image.tmdb.org/t/p/original${
                tvShow.poster_path || tvShow.backdrop_path
              }`}
              alt={tvShow.name}
              className="md:w-64 w-full h-96 object-fill rounded-lg shadow-lg"
            />

            <div className="flex-1">
              <div className="mb-4">
                <span className="bg-red-600 text-white px-2 py-1 text-sm font-bold rounded mr-2">
                  N SERIES
                </span>
                {tvShow.networks.map((network) => (
                  <span key={network.id} className="text-gray-400 text-sm">
                    {network.name}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {tvShow.name}
              </h1>
              {tvShow.original_name !== tvShow.name && (
                <p className="text-xl text-gray-400 mb-4">
                  {tvShow.original_name}
                </p>
              )}

              {tvShow.tagline && (
                <p className="text-lg text-gray-300 italic mb-4">
                  "{tvShow.tagline}"
                </p>
              )}

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Star
                    className="text-yellow-400"
                    size={20}
                    fill="currentColor"
                  />
                  <span className="text-lg font-bold">
                    {tvShow.vote_average.toFixed(1)}
                  </span>
                  <span className="text-gray-400">
                    ({tvShow.vote_count.toLocaleString()} votes)
                  </span>
                </div>
                <span className={`font-bold ${getStatusColor(tvShow.status)}`}>
                  {tvShow.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                <div>
                  <span className="text-gray-400 block">First Aired</span>
                  <span>{new Date(tvShow.first_air_date).getFullYear()}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Seasons</span>
                  <span>{tvShow.number_of_seasons}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Episodes</span>
                  <span>{tvShow.number_of_episodes}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Runtime</span>
                  <span>{tvShow.episode_run_time[0] || "N/A"} min</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <button className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200 transition-colors">
                  <Play size={20} fill="currentColor" />
                  <span>Play</span>
                </button>

                <button
                  onClick={handleAddToMyList}
                  className={`p-3 rounded-full border-2 transition-colors ${
                    tvShow && isInMyList(tvShow.id)
                      ? "bg-white text-black border-white"
                      : "border-gray-400 hover:border-white"
                  }`}
                  title={
                    tvShow && isInMyList(tvShow.id)
                      ? "Remove from My List"
                      : "Add to My List"
                  }
                >
                  {tvShow && isInMyList(tvShow.id) ? (
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
                {tvShow.overview}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {tvShow.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute z-10 top-40 md:top-50 lg:top-120 right-4 md:right-8 flex gap-2">
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

      {/* Tabs */}
      <div className="px-8 mt-12">
        <div className="flex space-x-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("episodes")}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === "episodes"
                ? "text-white border-b-2 border-red-600"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Episodes
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === "details"
                ? "text-white border-b-2 border-red-600"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Details & Cast
          </button>
        </div>
      </div>

      <div className="px-8 mt-8">
        {activeTab === "episodes" && (
          <div>
            <div className="mb-6">
              <select
                value={selectedSeason?.season_number || 1}
                onChange={(e) => {
                  const season = tvShow.seasons.find(
                    (s) => s.season_number === Number.parseInt(e.target.value)
                  );
                  setSelectedSeason(season || null);
                }}
                className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:border-red-600 focus:outline-none"
              >
                {tvShow.seasons.map((season) => (
                  <option key={season.id} value={season.season_number}>
                    {season.name} ({season.episode_count} episodes)
                  </option>
                ))}
              </select>
            </div>

            {/* Season details */}
            {selectedSeason && (
              <div className="mb-8">
                <div className="flex gap-6 mb-6">
                  <img
                    src={`https://image.tmdb.org/t/p/original${
                      selectedSeason.poster_path || tvShow.backdrop_path
                    }`}
                    alt={selectedSeason.name}
                    className="w-32 h-48 object-cover rounded-lg"
                  />
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {selectedSeason.name}
                    </h2>
                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <Calendar size={16} className="mr-1" />
                        {new Date(selectedSeason.air_date).getFullYear()}
                      </span>
                      <span>{selectedSeason.episode_count} episodes</span>
                      <span className="flex items-center">
                        <Star size={16} className="mr-1 text-yellow-400" />
                        {selectedSeason.vote_average.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {selectedSeason.overview}
                    </p>
                  </div>
                </div>

                {/* episodes List */}
                <div className="space-y-4">
                  {episodes &&
                    episodes.map((ep) => (
                      <div
                        key={ep.id}
                        className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <div className="text-xl sm:text-2xl font-bold text-gray-500 sm:w-8">
                          {ep.episode_number}
                        </div>
                        <img
                          src={
                            ep.still_path
                              ? `https://image.tmdb.org/t/p/original${ep.still_path}`
                              : "/placeholder.svg"
                          }
                          alt={ep.name}
                          className="w-full sm:w-32 h-48 sm:h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold mb-1">{ep.name}</h3>
                          <p className="text-sm text-gray-400 mb-2">
                            {ep.runtime ? `${ep.runtime} min` : "N/A"}
                          </p>
                          <p className="text-sm text-gray-300">
                            {ep.overview || "No description available."}
                          </p>
                        </div>
                        <button className="self-start sm:self-auto p-2 hover:bg-gray-700 rounded-full transition-colors">
                          <Play size={20} />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "details" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Show Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Created by: </span>
                  <span>
                    {tvShow.created_by.length > 0
                      ? tvShow.created_by.map((c) => c.name).join(", ")
                      : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">First Air Date: </span>
                  <span>
                    {new Date(tvShow.first_air_date).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Last Air Date: </span>
                  <span>
                    {new Date(tvShow.last_air_date).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Status: </span>
                  <span className={getStatusColor(tvShow.status)}>
                    {tvShow.status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Networks: </span>
                  <span>{tvShow.networks.map((n) => n.name).join(", ")}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Latest Episode</h3>
              {tvShow.last_episode_to_air && (
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">
                    {tvShow.last_episode_to_air.name}
                  </h4>
                  <p className="text-sm text-gray-400 mb-2">
                    Season {tvShow.last_episode_to_air.season_number}, Episode{" "}
                    {tvShow.last_episode_to_air.episode_number}
                  </p>
                  <p className="text-sm text-gray-400 mb-2">
                    Aired:{" "}
                    {new Date(
                      tvShow.last_episode_to_air.air_date
                    ).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-300">
                    {tvShow.last_episode_to_air.overview}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TVShowDetail;
