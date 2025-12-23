import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { fetchMovieDetails } from '../features/movies/moviesSlice.ts';
import { addFavoriteAsync, removeFavoriteAsync } from '../features/favorites/favoritesSlice.ts';
import { movieApi } from '../services/movieApi.ts';
import styles from './MovieDetailsPage.module.css';

export const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { movieDetails, loading, error } = useAppSelector((state) => state.movies);
  const favorites = useAppSelector((state) => state.favorites.favorites);

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieDetails(Number(id)));
    }
  }, [dispatch, id]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!movieDetails) return <div className={styles.error}>Movie not found</div>;

  const isFavorite = favorites.some((fav) => fav.id === movieDetails.id);

  const handleFavoriteClick = () => {
    if (isFavorite) {
      dispatch(removeFavoriteAsync(movieDetails.id));
    } else {
      dispatch(addFavoriteAsync(movieDetails));
    }
  };

  const year = movieDetails.release_date ? new Date(movieDetails.release_date).getFullYear() : 'N/A';
  const runtime = `${Math.floor(movieDetails.runtime / 60)}h ${movieDetails.runtime % 60}m`;

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className={styles.content}>
        <img
          src={movieApi.getImageUrl(movieDetails.poster_path)}
          alt={movieDetails.title}
          className={styles.poster}
        />

        <div className={styles.details}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>{movieDetails.title}</h1>
              {movieDetails.tagline && <p className={styles.tagline}>"{movieDetails.tagline}"</p>}
            </div>
            <div className={styles.actions}>
              <button
                className={styles.watchBtn}
                onClick={() => navigate(`/watch/${movieDetails.id}`)}
              >
                ▶️ Watch Now
              </button>
              <button
                className={`${styles.favoriteBtn} ${isFavorite ? styles.active : ''}`}
                onClick={handleFavoriteClick}
              >
                {isFavorite ? '❤️ Remove' : '🤍 Add to Favorites'}
              </button>
            </div>
          </div>

          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <span className={styles.rating}>⭐ {movieDetails.vote_average.toFixed(1)}</span>
              <span>({movieDetails.vote_count} votes)</span>
            </div>
            <div className={styles.metaItem}>📅 {year}</div>
            <div className={styles.metaItem}>⏱️ {runtime}</div>
            <div className={styles.metaItem}>📊 {movieDetails.status}</div>
          </div>

          {movieDetails.genres.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Genres</h2>
              <div className={styles.genres}>
                {movieDetails.genres.map((genre) => (
                  <span key={genre.id} className={styles.genre}>
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Overview</h2>
            <p className={styles.overview}>{movieDetails.overview || 'No overview available.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
