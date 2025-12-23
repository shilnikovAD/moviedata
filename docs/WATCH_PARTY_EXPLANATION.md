# Как работает совместный просмотр (Watch Party)

## Принцип работы

Функция совместного просмотра позволяет нескольким пользователям синхронно смотреть фильм и общаться в чате в реальном времени. Это реализовано с использованием **BroadcastChannel API** для синхронизации между вкладками браузера на одном устройстве или в локальной сети.

## Архитектура

### 1. BroadcastChannel API
- Используется для передачи сообщений между вкладками браузера
- Создается канал `watchparty_{roomId}` для каждой комнаты
- Все участники подключаются к одному каналу и обмениваются событиями

### 2. Redux State Management
- `watchPartySlice.ts` управляет состоянием комнаты (участники, сообщения, время воспроизведения)
- Состояние синхронизируется через localStorage для персистентности

### 3. Сервис WatchPartyService
- Обрабатывает подключение/отключение от комнаты
- Отправляет и получает сообщения через BroadcastChannel
- Эмулирует WebSocket для демонстрации

## Пошаговый сценарий использования

### Шаг 1: Создание комнаты (Хост)
1. Откройте страницу фильма (например, `/movie/1`)
2. Нажмите кнопку "Watch"
3. Перейдите на страницу просмотра `/watch/1`
4. Нажмите "Start Watch Party"
5. Введите своё имя
6. Система создаст уникальный ID комнаты (например: `room_abc123`)

### Шаг 2: Присоединение других участников
1. Скопируйте ID комнаты
2. Откройте новую вкладку браузера
3. Перейдите на `/watch-party/1?room=room_abc123`
4. Введите своё имя
5. Нажмите "Join Room"

### Шаг 3: Синхронизация просмотра
После подключения все участники:
- **Видят общий список участников** - кто находится в комнате
- **Синхронизируют воспроизведение**:
  - Когда хост нажимает Play - видео запускается у всех
  - Когда хост нажимает Pause - видео останавливается у всех
  - Перемотка синхронизируется между участниками
- **Обмениваются сообщениями в чате** в реальном времени

## Типы событий

```typescript
// Типы сообщений, которые передаются между участниками:
- 'join' - пользователь присоединился
- 'leave' - пользователь покинул комнату
- 'play' - воспроизведение запущено
- 'pause' - воспроизведение остановлено
- 'seek' - перемотка на определенное время
- 'chat' - сообщение в чате
- 'timeUpdate' - обновление текущего времени
```

## Как это работает технически

### 1. Создание комнаты
```typescript
// Хост создает комнату
dispatch(createRoom({
  roomId: 'room_abc123',
  movieId: 1,
  userId: 'user_xyz',
  userName: 'John'
}));

// Создается BroadcastChannel
const channel = new BroadcastChannel('watchparty_room_abc123');
```

### 2. Отправка события (Play)
```typescript
// Когда хост нажимает Play:
watchPartyService.sendMessage({
  type: 'play',
  roomId: 'room_abc123',
  userId: 'user_xyz',
  data: { currentTime: 10.5, isPlaying: true }
});
```

### 3. Получение события
```typescript
// Все другие участники получают событие:
channel.onmessage = (event) => {
  if (event.data.type === 'play') {
    dispatch(setPlaying(true));
    dispatch(setCurrentTime(event.data.data.currentTime));
    // Видео запускается у участника
  }
};
```

### 4. Чат
```typescript
// Отправка сообщения
watchPartyService.sendMessage({
  type: 'chat',
  roomId: 'room_abc123',
  userId: 'user_xyz',
  userName: 'John',
  data: { message: 'Привет всем!' }
});

// Получение в Redux
dispatch(addMessage({
  id: '...',
  userId: 'user_xyz',
  userName: 'John',
  message: 'Привет всем!',
  timestamp: Date.now()
}));
```

## Хранение данных

### localStorage используется для:
- **Список участников** - `participants_{roomId}`
- **История чата** - `messages_{roomId}`
- **Последнее состояние комнаты** - `watchparty_room_{roomId}`

Это позволяет:
- Сохранять состояние при перезагрузке страницы
- Новые участники видят историю чата
- Восстанавливать комнату после отключения

## Ограничения текущей реализации

1. **BroadcastChannel работает только на одном устройстве**
   - Участники должны быть на одном компьютере в разных вкладках
   - Для работы между устройствами нужен WebSocket сервер

2. **Демо-режим**
   - Видео трейлер загружается с YouTube
   - Для реального просмотра нужен источник видео

3. **Без аутентификации**
   - ID пользователя генерируется случайно
   - Нет постоянных аккаунтов

## Улучшения для продакшена

Для реального развертывания необходимо:

1. **WebSocket сервер** (Socket.io, WebRTC)
   ```javascript
   // Вместо BroadcastChannel
   const socket = io('wss://your-server.com');
   socket.emit('join', { roomId, userId });
   ```

2. **Система аутентификации**
   - Регистрация/вход
   - Постоянные ID пользователей

3. **Видео CDN**
   - Загрузка реальных фильмов
   - HLS/DASH для стриминга

4. **База данных**
   - Хранение комнат на сервере
   - История чатов в БД

## Реализация WebSocket сервера для работы между устройствами

### Готовое решение включено в проект!

В папке `server/` находится готовый WebSocket сервер на Node.js для синхронизации между устройствами.

### Быстрый старт

1. **Установка зависимостей сервера:**
```bash
cd server
npm install
```

2. **Запуск сервера:**
```bash
npm run dev
```
Сервер запустится на `http://localhost:3001`

3. **Настройка клиента:**
В файле `.env` добавьте:
```env
VITE_WS_URL=ws://localhost:3001
```

4. **Включение WebSocket в клиенте:**
В `src/services/watchPartyServiceWebSocket.ts` установите:
```typescript
const USE_WEBSOCKET = true;
```

5. **Замените импорт сервиса:**
В `src/pages/WatchPartyPage.tsx`:
```typescript
import { watchPartyService } from '../services/watchPartyServiceWebSocket';
```

### Архитектура WebSocket решения

#### Сервер (server/server.js)
- **WebSocket сервер** на порту 3001
- **Управление комнатами** - создание, присоединение, синхронизация
- **Broadcast сообщений** - отправка событий всем участникам комнаты
- **REST API** - просмотр активных комнат и их состояния

#### Клиент (src/services/watchPartyServiceWebSocket.ts)
- **Автоматическое переподключение** при обрыве связи
- **Fallback на BroadcastChannel** если WebSocket недоступен
- **Обработка всех событий** - play, pause, seek, chat

### Протокол обмена сообщениями

**Создание комнаты:**
```typescript
ws.send(JSON.stringify({
  type: 'create-room',
  roomId: 'room_abc123',
  movieId: 1,
  userId: 'user_xyz',
  userName: 'John'
}));
```

**Присоединение:**
```typescript
ws.send(JSON.stringify({
  type: 'join-room',
  roomId: 'room_abc123',
  userId: 'user_def',
  userName: 'Alice'
}));
```

**Синхронизация воспроизведения:**
```typescript
ws.send(JSON.stringify({
  type: 'play', // или 'pause', 'seek'
  roomId: 'room_abc123',
  userId: 'user_xyz',
  data: { currentTime: 10.5, isPlaying: true }
}));
```

**Чат:**
```typescript
ws.send(JSON.stringify({
  type: 'chat',
  roomId: 'room_abc123',
  userId: 'user_xyz',
  userName: 'John',
  data: { message: 'Hello everyone!' }
}));
```

### Развертывание в продакшен

#### Heroku (бесплатно)
```bash
cd server
heroku create your-watch-party-server
git push heroku main
```

#### Railway (бесплатно)
1. Подключите GitHub репозиторий
2. Выберите папку `server`
3. Railway автоматически развернет сервер
4. Скопируйте URL (например: `wss://your-app.railway.app`)
5. Обновите `.env`: `VITE_WS_URL=wss://your-app.railway.app`

#### Render (бесплатно)
1. Создайте новый Web Service
2. Подключите репозиторий
3. Root Directory: `server`
4. Build Command: `npm install`
5. Start Command: `npm start`

#### VPS (Digital Ocean, AWS)
```bash
# На сервере
git clone your-repo
cd server
npm install
npm install -g pm2
pm2 start server.js --name watch-party
pm2 save
pm2 startup
```

### Тестирование

1. Запустите сервер: `cd server && npm run dev`
2. Запустите клиент: `npm run dev`
3. Откройте на **двух разных устройствах** (или в разных браузерах)
4. Первое устройство: создайте комнату
5. Второе устройство: присоединитесь к комнате
6. Попробуйте управлять воспроизведением - синхронизация работает!

### Мониторинг

HTTP API для мониторинга:
- `GET http://localhost:3001/api/health` - статус сервера
- `GET http://localhost:3001/api/rooms` - список активных комнат
- `GET http://localhost:3001/api/rooms/:roomId` - информация о комнате

### Безопасность для продакшена

Рекомендации:
1. Добавьте JWT аутентификацию
2. Ограничьте CORS для ваших доменов
3. Добавьте rate limiting
4. Используйте WSS (WebSocket Secure) с SSL сертификатом
5. Валидируйте все входящие сообщения

Подробнее см. `server/README.md`

## Демонстрация

Чтобы увидеть работу:
```bash
npm run dev
```

1. Откройте `http://localhost:5173`
2. Выберите фильм
3. Нажмите "Watch" → "Start Watch Party"
4. Введите имя, скопируйте Room ID
5. Откройте новую вкладку
6. Перейдите на `/watch-party/1?room={скопированный_ID}`
7. Присоединитесь к комнате
8. Попробуйте управлять воспроизведением и чатом
