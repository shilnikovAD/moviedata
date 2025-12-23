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

## Развертывание WebSocket сервера на Railway

### Быстрое развертывание

#### Шаг 1: Создайте аккаунт на Railway
Перейдите на [railway.app](https://railway.app) и зарегистрируйтесь.

#### Шаг 2: Создайте новый проект
1. Нажмите **"New Project"**
2. Выберите **"Deploy from GitHub repo"**
3. Подключите ваш GitHub аккаунт
4. Выберите репозиторий с проектом

#### Шаг 3: Настройка переменных окружения
В настройках проекта добавьте:
```
PORT=3001
```

#### Шаг 4: Укажите корневую папку
В настройках проекта установите **Root Directory** на `server`

#### Шаг 5: Разверните
Railway автоматически обнаружит `package.json` и развернет сервер.

#### Шаг 6: Получите URL
После развертывания скопируйте **Public URL** (например: `https://your-app.railway.app`)

## Обновление клиента

### Шаг 1: Обновите переменные в Vercel
В настройках Vercel проекта добавьте/измените:
```
VITE_WS_URL=wss://your-app.railway.app
```

**Обратите внимание:** используйте `wss://` (WebSocket Secure), а не `ws://`

### Шаг 2: Передеплойте клиент
```bash
git add .
git commit -m "Update WebSocket URL for Railway"
git push origin main
```

## Проверка работы

1. Откройте приложение на Vercel
2. Создайте Watch Party комнату на одном устройстве
3. Откройте приложение на другом устройстве
4. Присоединитесь к комнате - синхронизация должна работать!

## Альтернативы

### Render (бесплатно)
1. Создайте **Web Service**
2. Подключите GitHub репозиторий
3. **Root Directory**: `server`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`

### Heroku (платно)
```bash
cd server
heroku create your-watch-party-server
git push heroku main
```

## Отладка

Если не работает:
1. Проверьте логи Railway/Render
2. Убедитесь что URL правильный (`wss://...`)
3. Проверьте консоль браузера на ошибки WebSocket

## Безопасность

Для продакшена рекомендуется:

1. Добавить аутентификацию (JWT токены)
2. Ограничить CORS для конкретных доменов
3. Добавить rate limiting
4. Использовать HTTPS/WSS
5. Валидировать все входящие сообщения
