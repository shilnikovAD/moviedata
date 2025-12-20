# MovieCatalog

## Описание приложения

MovieCatalog — это веб-приложение для просмотра каталога фильмов, поиска и управления избранными фильмами. Оно позволяет пользователям просматривать популярные фильмы, искать по названию, добавлять фильмы в избранное и организовывать совместный просмотр (Watch Party) с синхронизацией видео и чатом между участниками. Приложение использует API The Movie Database (TMDB) для получения данных о фильмах. Демо доступно по адресу [http://localhost:5173](http://localhost:5173) после запуска.

## Как получить исходники

```bash
git clone <repository-url>
cd moviedata
```

## Требования

- Node.js 22 LTS (скачать и установить с [официального сайта](https://nodejs.org/))
- npm (устанавливается вместе с Node.js) или yarn
- API ключ от The Movie Database (TMDB) — зарегистрируйтесь на [TMDB](https://www.themoviedb.org/) и получите ключ в разделе [API](https://www.themoviedb.org/settings/api)

База данных не требуется, так как приложение использует внешний API TMDB. Для локального тестирования можно использовать фикстуры в Cypress.

## Как запустить проект

### Установка зависимостей

```bash
cd moviedata
npm install
```

### Настройка переменных

Откройте файл `src/services/movieApi.ts` и замените значение `API_KEY` на ваш реальный API ключ от TMDB:

```typescript
const API_KEY = 'ваш_api_ключ_здесь';
```

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
