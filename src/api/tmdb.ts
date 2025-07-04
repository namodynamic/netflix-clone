import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchPopularMovies = async () => {
  const res = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  return res.data.results;
};

export const fetchTopRatedMovies = async () => {
  const res = await axios.get(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
  return res.data.results;
}

export const fetchMovieDetail = async (id: string) => {
  const res = await axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  return res.data;
};

export const fetchMovieVideos = async (id: string) => {
  const res = await axios.get(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`);
  return res.data.results;
};

export const fetchPopularTVShows = async () => {
  const res = await axios.get(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
  return res.data.results;
};

export const fetchTopTVShows = async () => {
  const res = await axios.get(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}`);
  return res.data.results;
};

export const fetchTrendingTVShows = async () => {
  const res = await axios.get(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`);
  return res.data.results;
}

export const fetchTVShowDetail = async (id: string) => {
  const res = await axios.get(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`);
  return res.data;
};

export const fetchTVShowVideos = async (series_id: string) => {
  const res = await axios.get(`${BASE_URL}/tv/${series_id}/videos?api_key=${API_KEY}`);
  return res.data.results;
};

export async function fetchSimilarMovies(movieId: string) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

export const fetchNowPlayingMovies = async () => {
  const res = await axios.get(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`);
  return res.data.results;
}

export const fetchMovieGenres = async () => {
  const res = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  return res.data.genres;
};

export const fetchMovieCredits = async (id: string) => {
  const res = await axios.get(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`);
  return res.data;
};

export const fetchMoviesByGenre = async (genreId: number) => {
  const res = await axios.get(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
  return res.data.results;
};

export const fetchSeasonEpisodes = async (tvId: string | number, seasonNumber: number) => {
  const res = await axios.get(`${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`);
  return res.data.episodes;
};

// Search functions
export const searchMulti = async (query: string, page: number = 1) => {
  const res = await axios.get(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
  return res.data;
};

export const searchMovies = async (query: string, page: number = 1) => {
  const res = await axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
  return res.data;
};

export const searchTVShows = async (query: string, page: number = 1) => {
  const res = await axios.get(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
  return res.data;
};
