import { describe, it, expect } from 'vitest';
import type { Movie } from '../types/movie.ts';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from '../features/movies/moviesSlice.ts';
import favoritesReducer from '../features/favorites/favoritesSlice.ts';
import { MovieCard } from './MovieCard.tsx';

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  overview: 'Test overview',
  poster_path: '/test.jpg',
  backdrop_path: '/test-backdrop.jpg',
  release_date: '2023-01-01',
  vote_average: 8.5,
  vote_count: 1000,
  popularity: 100,
};

const createTestStore = () => {
  return configureStore({
    reducer: {
      movies: moviesReducer,
      favorites: favoritesReducer,
    },
  });
};

describe('MovieCard', () => {
  it('renders movie title', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MovieCard movie={mockMovie} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
  });

  it('displays movie rating', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MovieCard movie={mockMovie} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/8\.5/)).toBeInTheDocument();
  });

  it('displays release year', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MovieCard movie={mockMovie} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('2023')).toBeInTheDocument();
  });
});
