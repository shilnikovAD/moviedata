export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  original_language?: string;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
}

export interface MoviesState {
  movies: Movie[];
  movieDetails: MovieDetails | null;
  searchResults: Movie[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

export interface FavoritesState {
  favorites: Movie[];
  loading: boolean;
  error: string | null;
}
