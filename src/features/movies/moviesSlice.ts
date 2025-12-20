import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { MoviesState } from '../../types/movie.ts';
import { movieApi } from '../../services/movieApi.ts';

const initialState: MoviesState = {
  movies: [],
  movieDetails: null,
  searchResults: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
};

// Async thunks
export const fetchPopularMovies = createAsyncThunk(
  'movies/fetchPopular',
  async (page: number = 1) => {
    const data = await movieApi.getPopularMovies(page);
    return data;
  }
);

export const searchMovies = createAsyncThunk(
  'movies/search',
  async ({ query, page }: { query: string; page?: number }) => {
    const data = await movieApi.searchMovies(query, page);
    return data;
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchDetails',
  async (movieId: number) => {
    const data = await movieApi.getMovieDetails(movieId);
    return data;
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearMovieDetails: (state) => {
      state.movieDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch popular movies
      .addCase(fetchPopularMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.results;
        state.totalPages = action.payload.total_pages;
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movies';
      })
      // Search movies
      .addCase(searchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.results;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search movies';
      })
      // Fetch movie details
      .addCase(fetchMovieDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.movieDetails = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movie details';
      });
  },
});

export const { clearSearchResults, clearMovieDetails } = moviesSlice.actions;
export default moviesSlice.reducer;
