import type { Movie, MovieDetails } from '../types/movie.ts';

const API_KEY = '6b9590515133272d26bc843f7189fd91'; // Replace with actual API key
const BASE_URL = 'https://api.themoviedb.org/3';

export const movieApi = {
  // Get popular movies
  getPopularMovies: async (page: number = 1): Promise<{ results: Movie[]; total_pages: number }> => {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
    );
    if (!response.ok) throw new Error('Failed to fetch popular movies');
    return response.json();
  },

  // Search movies
  searchMovies: async (query: string, page: number = 1): Promise<{ results: Movie[]; total_pages: number }> => {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    if (!response.ok) throw new Error('Failed to search movies');
    return response.json();
  },

  // Get movie details
  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
    );
    if (!response.ok) throw new Error('Failed to fetch movie details');
    return response.json();
  },


  // Get movie videos (trailers)
  getMovieVideos: async (movieId: number): Promise<{ results: Array<{
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
    official: boolean;
  }> }> => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
    );
    if (!response.ok) throw new Error('Failed to fetch movie videos');
    return response.json();
  },

  // Get image URL
  getImageUrl: (path: string | null, size: string = 'w500'): string => {
    if (!path) return '/placeholder.jpg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },
};
