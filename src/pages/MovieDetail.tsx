import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchMovieDetail } from "../api/tmdb";

type MovieDetailType = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
};

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMovieDetail(id)
        .then((data) => setMovie(data))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!movie) return <div className="p-4">Movie not found.</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Link to="/" className="text-red-500 hover:underline">&larr; Back to Home</Link>
      <div className="flex flex-col md:flex-row mt-4 gap-8 bg-zinc-800 rounded-lg shadow-lg p-6">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="rounded-lg w-full md:w-1/3 shadow-md"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <p className="text-gray-400 mb-2">Release Date: {movie.release_date}</p>
          <p className="text-yellow-400 font-semibold mb-2">Rating: {movie.vote_average}</p>
          <p className="mt-4 text-zinc-200">{movie.overview}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail; 