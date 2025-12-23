import type { WatchPartyMessage } from '../types/watchParty';

interface MessageData {
  roomId?: string;
  userId: string;
  userName?: string;
  data?: {
    currentTime?: number;
    isPlaying?: boolean;
    message?: string;
  };
}

// Конфигурация WebSocket сервера
const USE_WEBSOCKET = true; // true для реального WebSocket, false для BroadcastChannel
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

class WatchPartyService {
  private listeners: Map<string, Set<(data: MessageData) => void>> = new Map();
  private channel: BroadcastChannel | null = null;
  private ws: WebSocket | null = null;
  private roomId: string | null = null;
  private userId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(roomId: string, userId: string, userName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.roomId = roomId;
        this.userId = userId;

        if (USE_WEBSOCKET) {
          this.setupWebSocket(roomId, userId, userName, resolve, reject);
        } else {
          this.setupBroadcastChannel(roomId, userId, userName);
          setTimeout(() => {
            this.emit('connected', { roomId, userId, userName });
            resolve();
          }, 100);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private setupWebSocket(
    roomId: string,
    userId: string,
    userName: string,
    resolve: () => void,
    reject: (error: any) => void
  ) {
    console.log(`🔌 Connecting to WebSocket: ${WS_URL}`);

    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      console.log('✅ WebSocket connected');
      this.reconnectAttempts = 0;
      this.emit('connected', { roomId, userId, userName });
      resolve();
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('📨 WebSocket received:', message.type, message);

        // Не обрабатываем свои собственные сообщения
        if (message.userId === userId) {
          return;
        }

        this.emit(message.type, message);
      } catch (error) {
        console.error('❌ Error parsing WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      reject(error);
    };

    this.ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      this.emit('disconnected', { roomId, userId, userName });

      // Попытка переподключения
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`🔄 Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        setTimeout(() => {
          this.connect(roomId, userId, userName);
        }, 2000 * this.reconnectAttempts);
      }
    };
  }

  private setupBroadcastChannel(roomId: string, userId: string, userName: string) {
    // Fallback на BroadcastChannel для локальной синхронизации
    const channel = new BroadcastChannel(`watchparty_${roomId}`);
    console.log(`🎬 [BroadcastChannel] Connected to room: ${roomId} as ${userName} (${userId})`);

    channel.onmessage = (event) => {
      const message: WatchPartyMessage = event.data;
      console.log(`📨 [BroadcastChannel] Received:`, message.type, message);

      if (message.userId === userId) {
        return;
      }

      this.emit(message.type, message);
    };

    this.channel = channel;

    // Уведомляем о присоединении
    this.sendMessage({
      type: 'join',
      roomId,
      userId,
      userName,
    });
  }

  disconnect() {
    if (this.ws) {
      if (this.roomId && this.userId) {
        // Отправляем сообщение об уходе перед закрытием
        this.sendMessage({
          type: 'leave-room',
          roomId: this.roomId,
          userId: this.userId,
        });
      }
      this.ws.close();
      this.ws = null;
    }

    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }

    this.listeners.clear();
  }

  sendMessage(message: WatchPartyMessage) {
    if (USE_WEBSOCKET && this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log(`📤 WebSocket sending:`, message.type, message);
      this.ws.send(JSON.stringify(message));
    } else if (this.channel) {
      console.log(`📤 BroadcastChannel sending:`, message.type, message);
      this.channel.postMessage(message);

      // Сохраняем в localStorage
      const roomKey = `watchparty_room_${message.roomId}`;
      const roomData = JSON.parse(localStorage.getItem(roomKey) || '{}');
      roomData.lastMessage = message;
      roomData.timestamp = Date.now();
      localStorage.setItem(roomKey, JSON.stringify(roomData));
    } else {
      console.warn(`⚠️ No connection available to send message`);
    }
  }

  on(event: string, callback: (data: MessageData) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: (data: MessageData) => void) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit(event: string, data: MessageData) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  isConnected(): boolean {
    if (USE_WEBSOCKET) {
      return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }
    return this.channel !== null;
  }

  // Методы для управления воспроизведением
  play(roomId: string, userId: string, currentTime: number) {
    this.sendMessage({
      type: 'play',
      roomId,
      userId,
      data: { currentTime, isPlaying: true },
    });
  }

  pause(roomId: string, userId: string, currentTime: number) {
    this.sendMessage({
      type: 'pause',
      roomId,
      userId,
      data: { currentTime, isPlaying: false },
    });
  }

  seek(roomId: string, userId: string, currentTime: number) {
    this.sendMessage({
      type: 'seek',
      roomId,
      userId,
      data: { currentTime },
    });
  }

  sendChat(roomId: string, userId: string, userName: string, message: string) {
    this.sendMessage({
      type: 'chat',
      roomId,
      userId,
      userName,
      data: { message },
    });
  }

  // Генерация уникального ID для комнаты
  static generateRoomId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}

export const watchPartyService = new WatchPartyService();
export { WatchPartyService };
