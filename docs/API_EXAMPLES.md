# 🔧 Примеры использования Watch Party API

## Для разработчиков

### Создание комнаты программно

```typescript
import { useAppDispatch } from '../store/hooks';
import { createRoom } from '../features/watchParty/watchPartySlice';
import { watchPartyService, WatchPartyService } from '../services/watchPartyService';

// В вашем компоненте
const dispatch = useAppDispatch();
const userId = 'user123';
const userName = 'John Doe';
const movieId = 550; // Fight Club

// Создать комнату
const roomId = WatchPartyService.generateRoomId();
await watchPartyService.connect(roomId, userId, userName);

dispatch(createRoom({
  roomId,
  movieId,
  userId,
  userName,
}));

console.log(`Комната создана: ${roomId}`);
```

### Присоединение к комнате

```typescript
import { joinRoom } from '../features/watchParty/watchPartySlice';

const roomId = 'abc123'; // Полученный от друга
const userId = 'user456';
const userName = 'Jane Smith';
const movieId = 550;

await watchPartyService.connect(roomId, userId, userName);

dispatch(joinRoom({
  roomId,
  movieId,
  userId,
  userName,
}));
```

### Управление воспроизведением

```typescript
// Play
watchPartyService.play(roomId, userId, currentTime);
dispatch(setPlaying(true));

// Pause
watchPartyService.pause(roomId, userId, currentTime);
dispatch(setPlaying(false));

// Seek
watchPartyService.seek(roomId, userId, newTime);
dispatch(setCurrentTime(newTime));
```

### Отправка сообщений в чат

```typescript
import { addMessage } from '../features/watchParty/watchPartySlice';

const message = 'Привет всем!';

// Отправить через сервис
watchPartyService.sendChat(roomId, userId, userName, message);

// Добавить в локальное состояние
dispatch(addMessage({
  id: `${Date.now()}_${Math.random()}`,
  userId,
  userName,
  message,
  timestamp: Date.now(),
}));
```

### Подписка на события

```typescript
import { useEffect } from 'react';

useEffect(() => {
  // Подписаться на события
  const handlePlay = (data: any) => {
    console.log('Play event:', data);
    dispatch(setPlaying(true));
  };

  const handleChat = (data: any) => {
    console.log('New message:', data);
    dispatch(addMessage({
      id: `${Date.now()}_${Math.random()}`,
      userId: data.userId,
      userName: data.userName,
      message: data.data.message,
      timestamp: Date.now(),
    }));
  };

  watchPartyService.on('play', handlePlay);
  watchPartyService.on('chat', handleChat);

  // Отписаться при размонтировании
  return () => {
    watchPartyService.off('play', handlePlay);
    watchPartyService.off('chat', handleChat);
  };
}, [dispatch]);
```

### Получение состояния из Redux

```typescript
import { useAppSelector } from '../store/hooks';

function MyComponent() {
  const watchParty = useAppSelector((state) => state.watchParty);

  return (
    <div>
      <p>Room ID: {watchParty.roomId}</p>
      <p>Connected: {watchParty.connected ? 'Yes' : 'No'}</p>
      <p>Is Host: {watchParty.isHost ? 'Yes' : 'No'}</p>
      <p>Participants: {watchParty.participants.length}</p>
      <p>Playing: {watchParty.isPlaying ? 'Yes' : 'No'}</p>
      <p>Current Time: {watchParty.currentTime}s</p>
      
      <ul>
        {watchParty.participants.map(p => (
          <li key={p.id}>
            {p.name} {p.isHost && '(Host)'}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Покинуть комнату

```typescript
import { leaveRoom } from '../features/watchParty/watchPartySlice';

// Отключиться от сервиса
watchPartyService.disconnect();

// Очистить состояние
dispatch(leaveRoom());
```

## Интеграция с WebSocket (для production)

### Установка Socket.io

```bash
npm install socket.io-client
```

### Модифицированный watchPartyService.ts

```typescript
import { io, Socket } from 'socket.io-client';
import type { WatchPartyMessage } from '../types/watchParty';

class WatchPartyService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  connect(roomId: string, userId: string, userName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Подключение к WebSocket серверу
        this.socket = io('wss://your-server.com', {
          auth: { userId, userName },
        });

        // Присоединиться к комнате
        this.socket.emit('join-room', { roomId, userId, userName });

        // Обработчики событий
        this.socket.on('user-joined', (data) => {
          this.emit('join', data);
        });

        this.socket.on('user-left', (data) => {
          this.emit('leave', data);
        });

        this.socket.on('play', (data) => {
          this.emit('play', data);
        });

        this.socket.on('pause', (data) => {
          this.emit('pause', data);
        });

        this.socket.on('seek', (data) => {
          this.emit('seek', data);
        });

        this.socket.on('chat-message', (data) => {
          this.emit('chat', data);
        });

        this.socket.on('connect', () => {
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  play(roomId: string, userId: string, currentTime: number) {
    this.socket?.emit('play', { roomId, currentTime });
  }

  pause(roomId: string, userId: string, currentTime: number) {
    this.socket?.emit('pause', { roomId, currentTime });
  }

  seek(roomId: string, userId: string, currentTime: number) {
    this.socket?.emit('seek', { roomId, currentTime });
  }

  sendChat(roomId: string, userId: string, userName: string, message: string) {
    this.socket?.emit('chat-message', { roomId, message, userName });
  }

  // ...остальные методы
}
```

### Backend пример (Node.js + Socket.io)

```javascript
// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ roomId, userId, userName }) => {
    socket.join(roomId);
    console.log(`${userName} joined room ${roomId}`);
    
    // Уведомить других участников
    socket.to(roomId).emit('user-joined', { userId, userName });
    
    // Отправить список участников
    const room = io.sockets.adapter.rooms.get(roomId);
    const participantCount = room ? room.size : 0;
    socket.emit('room-info', { participantCount });
  });

  socket.on('play', ({ roomId, currentTime }) => {
    socket.to(roomId).emit('play', { currentTime });
  });

  socket.on('pause', ({ roomId, currentTime }) => {
    socket.to(roomId).emit('pause', { currentTime });
  });

  socket.on('seek', ({ roomId, currentTime }) => {
    socket.to(roomId).emit('seek', { currentTime });
  });

  socket.on('chat-message', ({ roomId, message, userName }) => {
    io.to(roomId).emit('chat-message', {
      message,
      userName,
      userId: socket.id,
      timestamp: Date.now(),
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Переменные окружения

Создайте `.env` файл:

```env
VITE_WEBSOCKET_URL=wss://your-server.com
VITE_API_KEY=your_tmdb_api_key
```

Использование в коде:

```typescript
const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;
const socket = io(WEBSOCKET_URL);
```

## Тестирование

### Unit тест для нового action

```typescript
import { describe, it, expect } from 'vitest';
import watchPartyReducer, { syncState } from './watchPartySlice';

describe('syncState', () => {
  it('should sync playback state', () => {
    const initialState = {
      currentTime: 0,
      isPlaying: false,
      // ...other fields
    };

    const actual = watchPartyReducer(
      initialState,
      syncState({ currentTime: 120, isPlaying: true })
    );

    expect(actual.currentTime).toBe(120);
    expect(actual.isPlaying).toBe(true);
  });
});
```

## Отладка

### Redux DevTools

Установите Redux DevTools Extension для браузера:
- Chrome: Redux DevTools
- Firefox: Redux DevTools

### Логирование событий

```typescript
watchPartyService.on('play', (data) => {
  console.log('[Watch Party] Play event:', data);
});

watchPartyService.on('pause', (data) => {
  console.log('[Watch Party] Pause event:', data);
});
```

### Проверка состояния

```typescript
// В консоли браузера
window.__REDUX_DEVTOOLS_EXTENSION__?.()
```

---

**Успешной разработки!** 🚀

