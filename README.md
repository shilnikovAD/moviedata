# MovieCatalog

## Описание приложения

MovieCatalog — это веб-приложение для просмотра каталога фильмов, поиска и управления избранными фильмами. Оно позволяет пользователям просматривать популярные фильмы, искать по названию, добавлять фильмы в избранное и организовывать совместный просмотр (Watch Party) с синхронизацией видео и чатом между участниками. Приложение использует API The Movie Database (TMDB) для получения данных о фильмах. Демо доступно по адресу [http://localhost:5173](http://localhost:5173) после запуска.

База данных реализована через Supabase для хранения избранных фильмов с использованием операций CRUD (GET, POST, DELETE). Асинхронные запросы обрабатываются через Redux с createAsyncThunk. Для получения высокой оценки реализована функция совместного просмотра с WebRTC для синхронизации видео и чата между участниками без единого бэкенд сервера.

Для демонстрации избранные фильмы хранятся в localStorage. Чтобы использовать Supabase, установите `USE_LOCAL_STORAGE = false` в `src/services/favoritesApi.ts` и настройте Supabase.

Приложение адаптировано для мобильных устройств с оптимизированными размерами элементов, сетками и компоновкой для экранов шириной менее 768px.

## Как получить исходники

```bash
git clone <repository-url>
cd moviedata
```

## Требования

- Node.js 22 LTS (скачать и установить с [официального сайта](https://nodejs.org/))
- npm (устанавливается вместе с Node.js) или yarn
- API ключ от The Movie Database (TMDB) — зарегистрируйтесь на [TMDB](https://www.themoviedb.org/) и получите ключ в разделе [API](https://www.themoviedb.org/settings/api)
- Аккаунт Supabase для базы данных (бесплатный тариф доступен)

База данных реализована через Supabase для хранения избранных фильмов. Для локального тестирования можно использовать фикстуры в Cypress.

## Как запустить проект

### Установка зависимостей

```bash
cd moviedata
npm install
```

### Настройка переменных

Откройте файл `src/services/movieApi.ts` и замените значение `API_KEY` на ваш реальный API ключ от TMDB, и установите `USE_MOCK = false` для использования реального API:

```typescript
const USE_MOCK = false; // Set to false to use real TMDB API
const API_KEY = 'ваш_api_ключ_здесь';
```

Для демонстрации приложение использует mock данные. Чтобы использовать реальный TMDB API, зарегистрируйтесь на [TMDB](https://www.themoviedb.org/) и получите ключ.

Создайте проект в Supabase (https://supabase.com), получите URL и анонимный ключ, и добавьте их в файл `.env`:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Создайте таблицу `favorites` в Supabase с колонками:
- `id` (uuid, primary key)
- `user_id` (text)
- `movie_id` (integer)
- `movie_data` (jsonb)

### Команда запуска приложения

```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:5173`.

## Шаги для выполнения главного бизнес-кейса

1. Запустите приложение (`npm run dev`) и откройте `http://localhost:5173`.
2. На главной странице просмотрите популярные фильмы.
3. Используйте поисковую строку для поиска фильмов по названию (например, "Inception").
4. Кликните на карточку фильма для просмотра деталей.
5. Добавьте фильм в избранное, нажав на сердечко.
6. Перейдите во вкладку "Favorites" для просмотра сохраненных фильмов.
7. Для совместного просмотра перейдите на страницу фильма, нажмите "Watch", затем используйте `/watch-party/{movieId}` для создания комнаты и синхронизации между вкладками. Функция совместного просмотра работает при дублировании страницы (открытии в новой вкладке) для синхронизации между участниками.Скопируйте id и вставьте его в дублированной странице 

## Структура приложения

```
src/
├── components/          # Переиспользуемые визуальные компоненты (MovieCard, SearchBar, VideoPlayer и т.д.)
├── features/            # Redux slices и бизнес-логика (favorites, movies, watchParty)
├── pages/               # Страницы приложения (HomePage, MovieDetailsPage, WatchPartyPage и т.д.)
├── services/            # API сервисы (movieApi.ts, watchPartyService.ts)
├── store/               # Настройка Redux store и hooks
├── types/               # TypeScript типы (movie.ts, watchParty.ts)
├── assets/              # Статические ресурсы (изображения, иконки)
└── stories/             # Storybook stories для компонентов
```

## Технологии

- **Frontend**: React 19, TypeScript, Vite
- **State Management**: Redux Toolkit
- **API**: The Movie Database (TMDB)
- **Database**: Supabase
- **Стилизация**: CSS Modules
- **Тестирование**: Vitest, Cypress
- **Документация**: Storybook

## Скрипты

- `npm run dev` - запуск сервера разработки
- `npm run build` - сборка для продакшена
- `npm run preview` - предварительный просмотр собранного приложения
- `npm run lint` - проверка кода ESLint
- `npm run test` - запуск unit-тестов
- `npm run test:ui` - запуск тестов с UI
- `npm run test:coverage` - запуск тестов с покрытием
- `npm run cypress` - запуск Cypress для e2e тестирования
- `npm run storybook` - запуск Storybook для просмотра компонентов

## Тестирование

### Unit тесты

```bash
npm run test
```

### E2E тесты

```bash
npm run cypress
```

### Компонентные тесты

```bash
npm run storybook
```

## Развертывание

Проект можно развернуть на любом статическом хостинге (Vercel, Netlify, GitHub Pages и т.д.).

Для GitHub Pages:

1. Соберите проект: `npm run build`
2. Скопируйте содержимое папки `dist` в ветку `gh-pages` или используйте GitHub Actions

## Лицензия

MIT License
