# Watch Party WebSocket Server

WebSocket сервер для синхронизации совместного просмотра между устройствами.

## Установка

```bash
cd server
npm install
```

## Запуск

### Режим разработки (с автоперезагрузкой)
```bash
npm run dev
```

### Продакшн режим
```bash
npm start
```

Сервер запустится на порту 3001 (или PORT из переменных окружения).

**После запуска откройте в браузере:** `http://localhost:3001`

Вы увидите статус сервера, активные комнаты и сможете протестировать WebSocket подключение.

## Endpoints

### HTTP (для браузера)
- `http://localhost:3001` - Главная страница с информацией и тестом WebSocket
- `http://localhost:3001/api/health` - Проверка статуса сервера
- `http://localhost:3001/api/rooms` - Список активных комнат
- `http://localhost:3001/api/rooms/:roomId` - Информация о конкретной комнате

### WebSocket (для клиента)
- `ws://localhost:3001` - WebSocket подключение для приложения

## Протокол WebSocket

### Клиент → Сервер

#### Создание комнаты
```json
{
  "type": "create-room",
  "roomId": "room_abc123",
  "movieId": 1,
  "userId": "user_xyz",
  "userName": "John"
}
```

#### Присоединение к комнате
```json
{
  "type": "join-room",
  "roomId": "room_abc123",
  "userId": "user_xyz",
  "userName": "John"
}
```

#### Выход из комнаты
```json
{
  "type": "leave-room",
  "roomId": "room_abc123",
  "userId": "user_xyz",
  "userName": "John"
}
```

#### Управление воспроизведением
```json
{
  "type": "play", // или "pause", "seek"
  "roomId": "room_abc123",
  "userId": "user_xyz",
  "data": {
    "currentTime": 10.5,
    "isPlaying": true
  }
}
```

#### Чат
```json
{
  "type": "chat",
  "roomId": "room_abc123",
  "userId": "user_xyz",
  "userName": "John",
  "data": {
    "message": "Hello everyone!"
  }
}
```

### Сервер → Клиент

#### Комната создана
```json
{
  "type": "room-created",
  "roomId": "room_abc123",
  "userId": "user_xyz",
  "userName": "John"
}
```

#### Присоединение подтверждено
```json
{
  "type": "room-joined",
  "roomId": "room_abc123",
  "userId": "user_xyz",
  "userName": "John",
  "roomInfo": {
    "roomId": "room_abc123",
    "participants": [...],
    "state": { "currentTime": 0, "isPlaying": false }
  }
}
```

#### Новый участник присоединился
```json
{
  "type": "participant-joined",
  "userId": "user_abc",
  "userName": "Alice",
  "participants": [...]
}
```

#### Участник покинул комнату
```json
{
  "type": "participant-left",
  "userId": "user_abc",
  "userName": "Alice",
  "participants": [...]
}
```

#### События воспроизведения
```json
{
  "type": "play", // или "pause", "seek"
  "userId": "user_xyz",
  "data": {
    "currentTime": 10.5,
    "isPlaying": true
  }
}
```

#### Сообщение чата
```json
{
  "type": "chat",
  "userId": "user_xyz",
  "userName": "John",
  "data": {
    "message": "Hello!"
  },
  "timestamp": 1703347200000
}
```

#### Ошибка
```json
{
  "type": "error",
  "message": "Room not found"
}
```

## Развертывание

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Railway
1. Подключите GitHub репозиторий
2. Выберите папку `server`
3. Автоматически развернется

### VPS (Digital Ocean, AWS, etc.)
```bash
# Установите Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Клонируйте репозиторий
git clone your-repo
cd server

# Установите зависимости
npm install

# Используйте PM2 для управления процессом
npm install -g pm2
pm2 start server.js
pm2 save
pm2 startup
```

### Docker
```dockerfile
FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

## Переменные окружения

- `PORT` - Порт сервера (по умолчанию 3001)

## Безопасность

Для продакшена рекомендуется:

1. Добавить аутентификацию (JWT токены)
2. Ограничить CORS для конкретных доменов
3. Добавить rate limiting
4. Использовать HTTPS/WSS
5. Валидировать все входящие сообщения
