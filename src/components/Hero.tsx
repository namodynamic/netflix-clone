import React, { useEffect, useState } from "react";
import { fetchMovieDetail, fetchMovieVideos } from "../api/tmdb";

interface HeroProps {
  movieId: number;
}

const Hero: React.FC<HeroProps> = ({ movieId }) => {
  const [movie, setMovie] = useState<any>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    fetchMovieDetail(String(movieId)).then(setMovie);
    fetchMovieVideos(String(movieId)).then((videos) => {
      const trailer = videos.find((v: any) => v.site === "YouTube" && v.type === "Trailer");
      setTrailerKey(trailer ? trailer.key : null);
    });
  }, [movieId]);

  if (!movie) return null;

  return (
    <section className="relative h-[60vw] min-h-[400px] w-full flex items-end  z-10">
      {trailerKey ? (
        <iframe
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}`}
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
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/60 to-transparent z-10" />
      <div className="relative z-20 p-8 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">{movie.title}</h1>
        <p className="mb-6 text-lg text-zinc-200 drop-shadow-md line-clamp-3">{movie.overview}</p>
        <div className="flex gap-4">
          <button className="bg-white text-black font-bold px-6 py-2 rounded hover:bg-zinc-200 transition">Play</button>
          <button className="bg-zinc-700/80 text-white font-bold px-6 py-2 rounded hover:bg-zinc-600 transition">More Info</button>
        </div>
      </div>
    </section>
  );
};

export default Hero; 