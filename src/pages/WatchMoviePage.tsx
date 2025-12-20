import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMovieDetails } from '../features/movies/moviesSlice';
import { movieApi } from '../services/movieApi';
import { VideoPlayer } from '../components/VideoPlayer';
import styles from './WatchMoviePage.module.css';

export const WatchMoviePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { movieDetails, loading } = useAppSelector((state) => state.movies);

  const [youtubeKey, setYoutubeKey] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieDetails(Number(id)));

      // Загружаем трейлер
      movieApi.getMovieVideos(Number(id)).then((data) => {
        const trailer = data.results.find(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        if (trailer) {
          setYoutubeKey(trailer.key);
        }
      }).catch(console.error);
    }
  }, [id, dispatch]);

  if (loading) {
    return <div className={styles.page}>Loading movie...</div>;
  }

  if (!movieDetails) {
    return <div className={styles.page}>Movie not found</div>;
  }

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate(`/movie/${id}`)}>
        ← Back to Details
      </button>

      <div className={styles.container}>
        <div className={styles.videoSection}>
          <VideoPlayer
            youtubeKey={youtubeKey}
            isPlaying={isPlaying}
            currentTime={currentTime}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onTimeUpdate={setCurrentTime}
            title={movieDetails.title}
          />
        </div>

        <div className={styles.info}>
          <h1 className={styles.title}>{movieDetails.title}</h1>
          {movieDetails.tagline && (
            <p className={styles.tagline}>"{movieDetails.tagline}"</p>
          )}

          <div className={styles.meta}>
            <span className={styles.rating}>
              ⭐ {movieDetails.vote_average.toFixed(1)}
            </span>
            <span>
              {movieDetails.release_date ? new Date(movieDetails.release_date).getFullYear() : 'N/A'}
            </span>
            <span>
              {movieDetails.runtime ? `${Math.floor(movieDetails.runtime / 60)}h ${movieDetails.runtime % 60}m` : 'N/A'}
            </span>
          </div>

          {movieDetails.genres.length > 0 && (
            <div className={styles.genres}>
              {movieDetails.genres.map((genre) => (
                <span key={genre.id} className={styles.genre}>
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <div className={styles.actions}>
            <button
              className={styles.watchPartyBtn}
              onClick={() => navigate(`/watch-party/${id}`)}
            >
              🎉 Start Watch Party
            </button>
          </div>

          <div className={styles.overview}>
            <h2>Overview</h2>
            <p>{movieDetails.overview || 'No overview available.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

