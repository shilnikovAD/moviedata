import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { FavoritesState, Movie } from '../../types/movie.ts';
import { favoritesApi } from '../../services/favoritesApi';

const initialState: FavoritesState = {
  favorites: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async () => {
    return await favoritesApi.getFavorites();
  }
);

export const addFavoriteAsync = createAsyncThunk(
  'favorites/addFavorite',
  async (movie: Movie) => {
    await favoritesApi.addToFavorites(movie);
    return movie;
  }
);

export const removeFavoriteAsync = createAsyncThunk(
  'favorites/removeFavorite',
  async (movieId: number) => {
    await favoritesApi.removeFromFavorites(movieId);
    return movieId;
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch favorites';
      })
      .addCase(addFavoriteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavoriteAsync.fulfilled, (state, action) => {
        state.loading = false;
        const exists = state.favorites.find((movie) => movie.id === action.payload.id);
        if (!exists) {
          state.favorites.push(action.payload);
        }
      })
      .addCase(addFavoriteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add favorite';
      })
      .addCase(removeFavoriteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavoriteAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = state.favorites.filter((movie) => movie.id !== action.payload);
      })
      .addCase(removeFavoriteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove favorite';
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
