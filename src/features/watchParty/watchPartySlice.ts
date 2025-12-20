import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { WatchPartyState, Participant, ChatMessage } from '../../types/watchParty';

// Вспомогательные функции для работы с localStorage
const getStorageKey = (roomId: string, type: 'participants' | 'messages') => `${type}_${roomId}`;

const loadFromStorage = (roomId: string): { participants: Participant[]; messages: ChatMessage[] } => {
  try {
    const participants = JSON.parse(localStorage.getItem(getStorageKey(roomId, 'participants')) || '[]');
    const messages = JSON.parse(localStorage.getItem(getStorageKey(roomId, 'messages')) || '[]');
    return { participants, messages };
  } catch {
    return { participants: [], messages: [] };
  }
};

const saveToStorage = (roomId: string, type: 'participants' | 'messages', data: Participant[] | ChatMessage[]) => {
  localStorage.setItem(getStorageKey(roomId, type), JSON.stringify(data));
};

const initialState: WatchPartyState = {
  roomId: null,
  isHost: false,
  participants: [],
  currentTime: 0,
  isPlaying: false,
  movieId: null,
  connected: false,
  messages: [],
};

const watchPartySlice = createSlice({
  name: 'watchParty',
  initialState,
  reducers: {
    createRoom: (state, action: PayloadAction<{ roomId: string; movieId: number; userId: string; userName: string }>) => {
      state.roomId = action.payload.roomId;
      state.movieId = action.payload.movieId;
      state.isHost = true;
      state.connected = true;
      state.participants = [{
        id: action.payload.userId,
        name: action.payload.userName,
        isHost: true,
      }];
      state.currentTime = 0;
      state.isPlaying = false;
      state.messages = [];

      // Сохраняем в localStorage
      saveToStorage(state.roomId, 'participants', state.participants);
      saveToStorage(state.roomId, 'messages', state.messages);
    },

    joinRoom: (state, action: PayloadAction<{ roomId: string; movieId: number; userId: string; userName: string }>) => {
      state.roomId = action.payload.roomId;
      state.movieId = action.payload.movieId;
      state.isHost = false;
      state.connected = true;

      // Загружаем существующие данные из localStorage
      const stored = loadFromStorage(state.roomId);
      state.participants = stored.participants;
      state.messages = stored.messages;

      // Добавляем себя, если не добавлен
      const existing = state.participants.find(p => p.id === action.payload.userId);
      if (!existing) {
        state.participants.push({
          id: action.payload.userId,
          name: action.payload.userName,
          isHost: false,
        });
        saveToStorage(state.roomId, 'participants', state.participants);
      }
    },

    leaveRoom: (state) => {
      if (state.roomId) {
        // Очищаем localStorage для комнаты
        localStorage.removeItem(getStorageKey(state.roomId, 'participants'));
        localStorage.removeItem(getStorageKey(state.roomId, 'messages'));
      }
      state.roomId = null;
      state.isHost = false;
      state.participants = [];
      state.connected = false;
      state.messages = [];
    },

    addParticipant: (state, action: PayloadAction<Participant>) => {
      const existing = state.participants.find(p => p.id === action.payload.id);
      if (!existing) {
        state.participants.push(action.payload);
        if (state.roomId) {
          saveToStorage(state.roomId, 'participants', state.participants);
        }
      }
    },

    removeParticipant: (state, action: PayloadAction<string>) => {
      state.participants = state.participants.filter(p => p.id !== action.payload);
      if (state.roomId) {
        saveToStorage(state.roomId, 'participants', state.participants);
      }
    },

    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },

    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },

    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
      if (state.roomId) {
        saveToStorage(state.roomId, 'messages', state.messages);
      }
    },

    loadFromStorageAction: (state) => {
      if (state.roomId) {
        const stored = loadFromStorage(state.roomId);
        state.participants = stored.participants;
        state.messages = stored.messages;
      }
    },
  },
});

export const {
  createRoom,
  joinRoom,
  leaveRoom,
  addParticipant,
  removeParticipant,
  setPlaying,
  setCurrentTime,
  addMessage,
  loadFromStorageAction,
} = watchPartySlice.actions;

export default watchPartySlice.reducer;
