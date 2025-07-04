export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date?: string;
  genre_ids?: number[];
  vote_count?: number;
  first_air_date?: string;
  name?: string;
}

export interface Genre {
  name: string;
  id: number;
}

export interface Season {
  air_date: string
  episode_count: number
  id: number
  name: string
  overview: string
  poster_path: string
  season_number: number
  vote_average: number
}

export interface Episode {
  id: number
  name: string
  overview: string
  vote_average: number
  vote_count: number
  air_date: string
  episode_number: number
  runtime: number
  season_number: number
  still_path: string
}

export interface TVShow {
  id: number
  name: string
  original_name: string
  overview: string
  backdrop_path: string
  poster_path: string
  first_air_date: string
  last_air_date: string
  vote_average: number
  vote_count: number
  number_of_seasons: number
  number_of_episodes: number
  status: string
  tagline: string
  genres: Array<{ id: number; name: string }>
  networks: Array<{ id: number; name: string; logo_path: string }>
  seasons: Season[]
  last_episode_to_air: Episode | null
  next_episode_to_air: Episode | null
  created_by: Array<{ id: number; name: string }>
  episode_run_time: number[]
}

export interface MyListItem {
  id: number
  title?: string // For movies
  name?: string // For TV shows
  poster_path: string
  backdrop_path?: string
  vote_average: number
  release_date?: string // For movies
  first_air_date?: string // For TV shows
  overview: string
  type: 'movie' | 'tv'
  genre_ids?: number[]
}

export interface MyListContextType {
  myList: MyListItem[]
  addToMyList: (item: MyListItem) => void
  removeFromMyList: (id: number) => void
  isInMyList: (id: number) => boolean
  clearMyList: () => void
}

export interface ToastProps {
  message: string
  type: 'success' | 'error'
  duration?: number
  onClose: () => void
}
