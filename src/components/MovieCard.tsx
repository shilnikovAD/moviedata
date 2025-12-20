import { useNavigate } from 'react-router-dom';
import type { Movie } from '../types/movie.ts';
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { addToFavorites, removeFromFavorites } from '../features/favorites/favoritesSlice.ts';
import { movieApi } from '../services/movieApi.ts';
import styles from './MovieCard.module.css';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

export const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const isFavorite = favorites.some((fav) => fav.id === movie.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFromFavorites(movie.id));
    } else {
      dispatch(addToFavorites(movie));
    }
  };

  const handleWatchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/watch/${movie.id}`);
  };

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.posterContainer}>
        <img
          src={movieApi.getImageUrl(movie.poster_path)}
          alt={movie.title}
          className={styles.poster}
        />
        <div className={styles.overlay}>
          <button className={styles.watchBtn} onClick={handleWatchClick}>
            ▶️ Watch
          </button>
        </div>
        <button
          className={`${styles.favoriteBtn} ${isFavorite ? styles.active : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{movie.title}</h3>
        <div className={styles.meta}>
          <span className={styles.rating}>⭐ {movie.vote_average.toFixed(1)}</span>
          <span className={styles.year}>{year}</span>
        </div>
      </div>
    </div>
  );
};
