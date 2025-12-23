import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { fetchFavorites, clearFavorites } from '../features/favorites/favoritesSlice.ts';
import { MovieCard } from '../components/MovieCard.tsx';
import styles from './FavoritesPage.module.css';

export const FavoritesPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { favorites, loading, error } = useAppSelector((state) => state.favorites);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all favorites?')) {
      dispatch(clearFavorites());
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Favorites</h1>
        <p className={styles.subtitle}>Your collection of favorite movies</p>
      </div>

      {loading && <p>Loading favorites...</p>}
      {error && <p>Error loading favorites: {error}</p>}

      {favorites.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>💔</div>
          <p>No favorites yet. Start adding movies you love!</p>
        </div>
      ) : (
        <>
          <button className={styles.clearBtn} onClick={handleClearAll}>
            Clear All Favorites
          </button>
          <div className={styles.grid}>
            {favorites.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => navigate(`/movie/${movie.id}`)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
