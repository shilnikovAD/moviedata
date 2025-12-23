import type { Movie } from '../types/movie'

// Use localStorage for demo, replace with Supabase for production
const USE_LOCAL_STORAGE = true; // Set to false to use Supabase

const STORAGE_KEY = 'favorites';

const getStoredFavorites = (): Movie[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const setStoredFavorites = (favorites: Movie[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
};

export const favoritesApi = {
  // GET: Fetch user's favorites
  getFavorites: async (): Promise<Movie[]> => {
    if (USE_LOCAL_STORAGE) {
      // Simulate async delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return getStoredFavorites();
    } else {
      // Supabase implementation
      const { supabase } = await import('./supabaseClient');
      const USER_ID = 'anonymous-user';
      const { data, error } = await supabase
        .from('favorites')
        .select('movie_data')
        .eq('user_id', USER_ID);

      if (error) throw error;
      return data?.map(item => item.movie_data) || [];
    }
  },

  // POST: Add to favorites
  addToFavorites: async (movie: Movie): Promise<void> => {
    if (USE_LOCAL_STORAGE) {
      await new Promise(resolve => setTimeout(resolve, 100));
      const favorites = getStoredFavorites();
      if (!favorites.find(f => f.id === movie.id)) {
        favorites.push(movie);
        setStoredFavorites(favorites);
      }
    } else {
      const { supabase } = await import('./supabaseClient');
      const USER_ID = 'anonymous-user';
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: USER_ID, movie_id: movie.id, movie_data: movie });

      if (error) throw error;
    }
  },

  // DELETE: Remove from favorites
  removeFromFavorites: async (movieId: number): Promise<void> => {
    if (USE_LOCAL_STORAGE) {
      await new Promise(resolve => setTimeout(resolve, 100));
      const favorites = getStoredFavorites();
      const filtered = favorites.filter(f => f.id !== movieId);
      setStoredFavorites(filtered);
    } else {
      const { supabase } = await import('./supabaseClient');
      const USER_ID = 'anonymous-user';
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', USER_ID)
        .eq('movie_id', movieId);

      if (error) throw error;
    }
  },
};
