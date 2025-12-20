import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

export const Header = () => {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.top}>
          <Link to="/" className={styles.logo}>
            🎬 MovieCatalog
          </Link>
          <nav>
            <ul className={styles.nav}>
              <li>
                <Link
                  to="/"
                  className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className={`${styles.navLink} ${location.pathname === '/favorites' ? styles.active : ''}`}
                >
                  Favorites
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`${styles.navLink} ${location.pathname === '/about' ? styles.active : ''}`}
                >
                  About
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};
