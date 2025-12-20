import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { Header } from './components/Header.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { MovieDetailsPage } from './pages/MovieDetailsPage.tsx';
import { FavoritesPage } from './pages/FavoritesPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { WatchPartyPage } from './pages/WatchPartyPage.tsx';
import { WatchMoviePage } from './pages/WatchMoviePage.tsx';
import { TestPage } from './pages/TestPage.tsx';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movie/:id" element={<MovieDetailsPage />} />
              <Route path="/watch/:id" element={<WatchMoviePage />} />
              <Route path="/watch-party/:id" element={<WatchPartyPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/test" element={<TestPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
