import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// HTTP сервер
const server = createServer(app);

// WebSocket сервер
const wss = new WebSocketServer({ server });

// Хранилище активных комнат и участников
const rooms = new Map(); // roomId -> { participants: Map, state: { currentTime, isPlaying } }

// Вспомогательные функции
function broadcastToRoom(roomId, message, excludeUserId = null) {
  const room = rooms.get(roomId);
  if (!room) return;

  const messageStr = JSON.stringify(message);

  room.participants.forEach((participant, userId) => {
    if (userId !== excludeUserId && participant.ws.readyState === 1) {
      participant.ws.send(messageStr);
    }
  });
}

function getRoomInfo(roomId) {
  const room = rooms.get(roomId);
  if (!room) return null;

  return {
    roomId,
    participants: Array.from(room.participants.values()).map(p => ({
      id: p.userId,
      name: p.userName,
      isHost: p.isHost,
    })),
    state: room.state,
  };
}

// WebSocket обработчики
wss.on('connection', (ws) => {
  let currentUserId = null;
  let currentRoomId = null;

  console.log('🔌 New WebSocket connection');

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('📨 Received:', message.type, message);

      switch (message.type) {
        case 'create-room': {
          const { roomId, movieId, userId, userName } = message;
          currentUserId = userId;
          currentRoomId = roomId;

          // Создаём новую комнату
          rooms.set(roomId, {
            participants: new Map([[userId, {
              ws,
              userId,
              userName,
              isHost: true,
              joinedAt: Date.now()
            }]]),
            state: {
              currentTime: 0,
              isPlaying: false,
              movieId,
            },
            createdAt: Date.now(),
          });

          // Подтверждение создания
          ws.send(JSON.stringify({
            type: 'room-created',
            roomId,
            userId,
            userName,
          }));

          console.log(`🎬 Room created: ${roomId} by ${userName}`);
          break;
        }

        case 'join-room': {
          const { roomId, userId, userName } = message;
          currentUserId = userId;
          currentRoomId = roomId;

          const room = rooms.get(roomId);

          if (!room) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Room not found',
            }));
            return;
          }

          // Добавляем участника
          room.participants.set(userId, {
            ws,
            userId,
            userName,
            isHost: false,
            joinedAt: Date.now(),
          });

          // Отправляем новому участнику текущее состояние комнаты
          ws.send(JSON.stringify({
            type: 'room-joined',
            roomId,
            userId,
            userName,
            roomInfo: getRoomInfo(roomId),
          }));

          // Уведомляем всех о новом участнике
          broadcastToRoom(roomId, {
            type: 'participant-joined',
            userId,
            userName,
            participants: getRoomInfo(roomId).participants,
          }, userId);

          console.log(`👋 ${userName} joined room ${roomId}`);
          break;
        }

        case 'leave-room': {
          const { roomId, userId, userName } = message;

          const room = rooms.get(roomId);
          if (!room) return;

          room.participants.delete(userId);

          // Уведомляем всех об уходе
          broadcastToRoom(roomId, {
            type: 'participant-left',
            userId,
            userName,
            participants: getRoomInfo(roomId).participants,
          });

          // Если комната пуста - удаляем
          if (room.participants.size === 0) {
            rooms.delete(roomId);
            console.log(`🗑️ Room ${roomId} deleted (empty)`);
          }

          console.log(`👋 ${userName} left room ${roomId}`);
          break;
        }

        case 'play':
        case 'pause':
        case 'seek': {
          const { roomId, userId, data } = message;

          const room = rooms.get(roomId);
          if (!room) return;

          // Обновляем состояние комнаты
          if (data.currentTime !== undefined) {
            room.state.currentTime = data.currentTime;
          }
          if (data.isPlaying !== undefined) {
            room.state.isPlaying = data.isPlaying;
          }

          // Транслируем всем участникам
          broadcastToRoom(roomId, {
            type: message.type,
            userId,
            data,
          }, userId);

          console.log(`🎬 ${message.type} in room ${roomId}`);
          break;
        }

        case 'chat': {
          const { roomId, userId, userName, data } = message;

          // Транслируем сообщение всем в комнате
          broadcastToRoom(roomId, {
            type: 'chat',
            userId,
            userName,
            data,
            timestamp: Date.now(),
          });

          console.log(`💬 Chat message in ${roomId} from ${userName}`);
          break;
        }

        case 'time-update': {
          const { roomId, userId, data } = message;

          const room = rooms.get(roomId);
          if (!room) return;

          room.state.currentTime = data.currentTime;

          // Отправляем обновление только хосту или периодически всем
          // (для экономии трафика можно отправлять раз в секунду)
          break;
        }

        default:
          console.log('⚠️ Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('❌ Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: error.message,
      }));
    }
  });

  ws.on('close', () => {
    console.log('🔌 WebSocket disconnected');

    // Удаляем участника из комнаты при отключении
    if (currentRoomId && currentUserId) {
      const room = rooms.get(currentRoomId);
      if (room) {
        const participant = room.participants.get(currentUserId);
        if (participant) {
          room.participants.delete(currentUserId);

          broadcastToRoom(currentRoomId, {
            type: 'participant-left',
            userId: currentUserId,
            userName: participant.userName,
            participants: getRoomInfo(currentRoomId)?.participants || [],
          });

          if (room.participants.size === 0) {
            rooms.delete(currentRoomId);
            console.log(`🗑️ Room ${currentRoomId} deleted (empty)`);
          }
        }
      }
    }
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
});

// Главная страница
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Watch Party WebSocket Server</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          background: #0d1117;
          color: #c9d1d9;
        }
        h1 { color: #58a6ff; }
        .status { 
          padding: 10px; 
          background: #161b22; 
          border-radius: 6px; 
          margin: 20px 0;
        }
        .status-ok { border-left: 4px solid #3fb950; }
        pre { 
          background: #161b22; 
          padding: 15px; 
          border-radius: 6px; 
          overflow-x: auto;
        }
        code { color: #79c0ff; }
        a { color: #58a6ff; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .endpoint { 
          background: #161b22; 
          padding: 10px; 
          margin: 10px 0; 
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <h1>🎬 Watch Party WebSocket Server</h1>
      
      <div class="status status-ok">
        <strong>✅ Сервер работает!</strong>
      </div>

      <h2>📊 Статистика</h2>
      <div class="endpoint">
        <strong>Активных комнат:</strong> ${rooms.size}<br>
        <strong>WebSocket URL:</strong> <code>ws://localhost:${PORT}</code>
      </div>

      <h2>🔗 API Endpoints</h2>
      <div class="endpoint">
        <a href="/api/health">GET /api/health</a> - Проверка статуса
      </div>
      <div class="endpoint">
        <a href="/api/rooms">GET /api/rooms</a> - Список активных комнат
      </div>

      <h2>📝 Как использовать</h2>
      <ol>
        <li>Настройте клиент на подключение к <code>ws://localhost:${PORT}</code></li>
        <li>Откройте приложение MovieCatalog</li>
        <li>Создайте комнату для совместного просмотра</li>
        <li>Пригласите друзей по Room ID</li>
      </ol>

      <h2>🔌 Тест WebSocket подключения</h2>
      <button onclick="testWebSocket()" style="padding: 10px 20px; background: #238636; color: white; border: none; border-radius: 6px; cursor: pointer;">
        Проверить WebSocket
      </button>
      <pre id="wsLog" style="margin-top: 10px; min-height: 100px;">Нажмите кнопку для проверки подключения...</pre>

      <script>
        function testWebSocket() {
          const log = document.getElementById('wsLog');
          log.textContent = '🔌 Подключение к WebSocket...\\n';
          
          try {
            const ws = new WebSocket('ws://localhost:${PORT}');
            
            ws.onopen = () => {
              log.textContent += '✅ Подключение установлено!\\n';
              log.textContent += 'Отправка тестового сообщения...\\n';
              
              ws.send(JSON.stringify({
                type: 'ping',
                timestamp: Date.now()
              }));
            };
            
            ws.onmessage = (event) => {
              log.textContent += '📨 Получено: ' + event.data + '\\n';
            };
            
            ws.onerror = (error) => {
              log.textContent += '❌ Ошибка подключения\\n';
              console.error(error);
            };
            
            ws.onclose = () => {
              log.textContent += '🔌 Соединение закрыто\\n';
            };
            
            setTimeout(() => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.close();
              }
            }, 3000);
          } catch (error) {
            log.textContent += '❌ Ошибка: ' + error.message + '\\n';
          }
        }
      </script>

      <hr style="margin: 40px 0; border: none; border-top: 1px solid #30363d;">
      
      <p style="text-align: center; color: #8b949e;">
        📖 <a href="https://github.com/your-repo/server">Документация</a> | 
        🐛 <a href="https://github.com/your-repo/issues">Сообщить об ошибке</a>
      </p>
    </body>
    </html>
  `);
});

// REST API endpoints (опционально)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', rooms: rooms.size });
});

app.get('/api/rooms', (req, res) => {
  const roomsList = Array.from(rooms.entries()).map(([roomId, room]) => ({
    roomId,
    participants: room.participants.size,
    state: room.state,
    createdAt: room.createdAt,
  }));
  res.json({ rooms: roomsList });
});

app.get('/api/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  const roomInfo = getRoomInfo(roomId);

  if (!roomInfo) {
    return res.status(404).json({ error: 'Room not found' });
  }

  res.json(roomInfo);
});

// Запуск сервера
server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
  console.log(`   HTTP: http://localhost:${PORT}`);
  console.log(`   WebSocket: ws://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
