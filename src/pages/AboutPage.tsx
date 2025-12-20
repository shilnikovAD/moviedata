import styles from './AboutPage.module.css';

export const AboutPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>About MovieCatalog</h1>
        <p className={styles.subtitle}>Your personal movie discovery platform</p>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>About the Project</h2>
          <p className={styles.text}>
            MovieCatalog is a modern React application built with TypeScript that helps you discover,
            search, and organize your favorite movies. Powered by The Movie Database (TMDB) API,
            it provides up-to-date information about thousands of movies.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Features</h2>
          <ul className={styles.features}>
            <li className={styles.feature}>
              <span className={styles.icon}>🔍</span>
              <span>Search through thousands of movies</span>
            </li>
            <li className={styles.feature}>
              <span className={styles.icon}>⭐</span>
              <span>View detailed information including ratings and reviews</span>
            </li>
            <li className={styles.feature}>
              <span className={styles.icon}>❤️</span>
              <span>Save your favorite movies for quick access</span>
            </li>
            <li className={styles.feature}>
              <span className={styles.icon}>📱</span>
              <span>Fully responsive design for all devices</span>
            </li>
            <li className={styles.feature}>
              <span className={styles.icon}>🎨</span>
              <span>Modern and intuitive user interface</span>
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Technologies Used</h2>
          <div className={styles.tech}>
            <span className={styles.techItem}>React 19</span>
            <span className={styles.techItem}>TypeScript</span>
            <span className={styles.techItem}>Redux Toolkit</span>
            <span className={styles.techItem}>React Router</span>
            <span className={styles.techItem}>CSS Modules</span>
            <span className={styles.techItem}>Vite</span>
            <span className={styles.techItem}>Vitest</span>
            <span className={styles.techItem}>Storybook</span>
            <span className={styles.techItem}>Cypress</span>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Data Source</h2>
          <p className={styles.text}>
            This product uses the TMDB API but is not endorsed or certified by TMDB.
            All movie data, images, and information are provided by The Movie Database.
          </p>
        </div>
      </div>
    </div>
  );
};
