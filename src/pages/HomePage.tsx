import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { fetchPopularMovies, searchMovies, clearSearchResults } from '../features/movies/moviesSlice.ts';
import { MovieCard } from '../components/MovieCard.tsx';
import { SearchBar } from '../components/SearchBar.tsx';
import styles from './HomePage.module.css';

export const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { movies, searchResults, loading, error } = useAppSelector((state) => state.movies);

  useEffect(() => {
    dispatch(fetchPopularMovies(1));
  }, [dispatch]);

  const handleSearch = (query: string) => {
    dispatch(searchMovies({ query }));
  };

  const handleClearSearch = () => {
    dispatch(clearSearchResults());
  };

  const displayMovies = searchResults.length > 0 ? searchResults : movies;
  const isSearchActive = searchResults.length > 0;

  return (
    <div className={styles.page}>
      <div className={styles.searchSection}>
        <div className={styles.header}>
          <h1 className={styles.title}>Discover Movies</h1>
          <p className={styles.subtitle}>Browse popular movies or search for your favorites</p>
        </div>
        <SearchBar onSearch={handleSearch} />
        {isSearchActive && (
          <button className={styles.clearBtn} onClick={handleClearSearch}>
            Clear Search Results
          </button>
        )}
      </div>

      {loading && <div className={styles.loading}>Loading...</div>}
      {error && <div className={styles.error}>{error}</div>}
      
      {!loading && !error && displayMovies.length === 0 && (
        <div className={styles.empty}>No movies found</div>
      )}

      {!loading && displayMovies.length > 0 && (
        <div className={styles.grid}>
          {displayMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => navigate(`/movie/${movie.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
