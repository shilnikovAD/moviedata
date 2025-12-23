import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addFavoriteAsync, removeFavoriteAsync, clearFavorites } from '../features/favorites/favoritesSlice';
import styles from './TestPage.module.css';

export const TestPage = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const watchParty = useAppSelector((state) => state.watchParty);

  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string, success: boolean) => {
    const emoji = success ? '✅' : '❌';
    setTestResults(prev => [...prev, `${emoji} ${result}`]);
  };

  const testFavorites = () => {
    setTestResults([]);
    addTestResult('Starting Favorites test...', true);

    // Тест 1: Добавление в избранное
    const testMovie = {
      id: 999999,
      title: 'Test Movie',
      overview: 'This is a test movie',
      poster_path: '/test.jpg',
      backdrop_path: '/test_backdrop.jpg',
      release_date: '2025-12-17',
      vote_average: 9.5,
      vote_count: 100,
      popularity: 100,
    };

    dispatch(addFavoriteAsync(testMovie));

    setTimeout(() => {
      const inStore = favorites.some(f => f.id === 999999);
      addTestResult('Test 1: Add to favorites', inStore);

      // Тест 2: Проверка localStorage
      const localData = localStorage.getItem('favorites');
      const hasInLocal = localData?.includes('999999') || false;
      addTestResult('Test 2: LocalStorage save', hasInLocal);

      // Тест 3: Удаление из избранного
      dispatch(removeFavoriteAsync(999999));

      setTimeout(() => {
        const stillInStore = favorites.some(f => f.id === 999999);
        addTestResult('Test 3: Remove from favorites', !stillInStore);

        // Тест 4: Очистка всех
        dispatch(addFavoriteAsync(testMovie));
        setTimeout(() => {
          dispatch(clearFavorites());
          setTimeout(() => {
            addTestResult('Test 4: Clear all favorites', favorites.length === 0);
            addTestResult('✨ Favorites tests completed!', true);
          }, 100);
        }, 100);
      }, 100);
    }, 100);
  };

  const testWatchParty = () => {
    setTestResults([]);
    addTestResult('Starting Watch Party test...', true);

    // Проверка состояния
    addTestResult(`Connected: ${watchParty.connected}`, watchParty.connected);
    addTestResult(`Room ID: ${watchParty.roomId || 'none'}`, !!watchParty.roomId);
    addTestResult(`Participants: ${watchParty.participants.length}`, watchParty.participants.length > 0);
    addTestResult(`Is Host: ${watchParty.isHost}`, true);

    // Проверка BroadcastChannel
    try {
      const testChannel = new BroadcastChannel('test_channel');
      testChannel.close();
      addTestResult('BroadcastChannel API available', true);
    } catch {
      addTestResult('BroadcastChannel API NOT available', false);
    }

    addTestResult('✨ Watch Party checks completed!', true);
  };

  const testLocalStorage = () => {
    setTestResults([]);
    addTestResult('Testing localStorage...', true);

    try {
      // Тест записи
      localStorage.setItem('test_key', 'test_value');
      const value = localStorage.getItem('test_key');
      addTestResult('localStorage write/read', value === 'test_value');
      localStorage.removeItem('test_key');

      // Проверка favorites
      const favData = localStorage.getItem('favorites');
      addTestResult(`Favorites in localStorage: ${favData ? 'yes' : 'no'}`, true);

      if (favData) {
        const parsed = JSON.parse(favData);
        addTestResult(`Favorites count: ${parsed.length}`, true);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      addTestResult(`localStorage error: ${errorMessage}`, false);
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  const checkBrowserSupport = () => {
    setTestResults([]);
    addTestResult('Checking browser support...', true);

    // BroadcastChannel
    const hasBroadcast = typeof BroadcastChannel !== 'undefined';
    addTestResult('BroadcastChannel API', hasBroadcast);

    // localStorage
    const hasStorage = typeof localStorage !== 'undefined';
    addTestResult('localStorage API', hasStorage);

    // Fetch API
    const hasFetch = typeof fetch !== 'undefined';
    addTestResult('Fetch API', hasFetch);

    // Modern JS features
    addTestResult('Promises', typeof Promise !== 'undefined');
    addTestResult('Async/Await', true);

    addTestResult('✨ Browser check completed!', true);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🧪 Test Dashboard</h1>
      <p className={styles.subtitle}>Debugging tools for MovieCatalog</p>

      <div className={styles.section}>
        <h2>Current State</h2>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.label}>Favorites Count:</span>
            <span className={styles.value}>{favorites.length}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Watch Party Room:</span>
            <span className={styles.value}>{watchParty.roomId || 'Not connected'}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Participants:</span>
            <span className={styles.value}>{watchParty.participants.length}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Is Playing:</span>
            <span className={styles.value}>{watchParty.isPlaying ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Test Controls</h2>
        <div className={styles.buttons}>
          <button className={styles.btn} onClick={testFavorites}>
            Test Favorites
          </button>
          <button className={styles.btn} onClick={testWatchParty}>
            Test Watch Party
          </button>
          <button className={styles.btn} onClick={testLocalStorage}>
            Test localStorage
          </button>
          <button className={styles.btn} onClick={checkBrowserSupport}>
            Check Browser Support
          </button>
          <button className={styles.btnSecondary} onClick={clearTestResults}>
            Clear Results
          </button>
        </div>
      </div>

      {testResults.length > 0 && (
        <div className={styles.section}>
          <h2>Test Results</h2>
          <div className={styles.results}>
            {testResults.map((result, index) => (
              <div key={index} className={styles.result}>
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h2>Debug Info</h2>
        <div className={styles.debug}>
          <h3>Favorites Data:</h3>
          <pre>{JSON.stringify(favorites, null, 2)}</pre>

          <h3>Watch Party Data:</h3>
          <pre>{JSON.stringify({
            connected: watchParty.connected,
            roomId: watchParty.roomId,
            isHost: watchParty.isHost,
            isPlaying: watchParty.isPlaying,
            currentTime: watchParty.currentTime,
            participants: watchParty.participants,
            messagesCount: watchParty.messages.length,
          }, null, 2)}</pre>

          <h3>localStorage:</h3>
          <pre>{localStorage.getItem('favorites') || 'Empty'}</pre>
        </div>
      </div>
    </div>
  );
};
