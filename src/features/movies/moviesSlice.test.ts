import { describe, it, expect } from 'vitest';
import type { MoviesState } from '../../types/movie.ts';
import moviesReducer, { clearSearchResults, clearMovieDetails } from './moviesSlice.ts';

const initialState: MoviesState = {
  movies: [],
  movieDetails: null,
  searchResults: [{ 
    id: 1, 
    title: 'Test',
    overview: '',
    poster_path: null,
    backdrop_path: null,
    release_date: '',
    vote_average: 0,
    vote_count: 0,
    popularity: 0
  }],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
};

describe('moviesSlice', () => {
  it('should clear search results', () => {
    const state = moviesReducer(initialState, clearSearchResults());
    expect(state.searchResults).toEqual([]);
  });

  it('should clear movie details', () => {
    const stateWithDetails = {
      ...initialState,
      movieDetails: {
        id: 1,
        title: 'Test',
        overview: '',
        poster_path: null,
        backdrop_path: null,
        release_date: '',
        vote_average: 0,
        vote_count: 0,
        popularity: 0,
        genres: [],
        runtime: 120,
        status: 'Released',
        tagline: '',
        budget: 0,
        revenue: 0,
      },
    };
    const state = moviesReducer(stateWithDetails, clearMovieDetails());
    expect(state.movieDetails).toBeNull();
  });
});
