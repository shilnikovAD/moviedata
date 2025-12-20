export interface WatchPartyState {
  roomId: string | null;
  isHost: boolean;
  participants: Participant[];
  currentTime: number;
  isPlaying: boolean;
  movieId: number | null;
  connected: boolean;
  messages: ChatMessage[];
}

export interface Participant {
  id: string;
  name: string;
  isHost: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
}

export interface WatchPartyMessage {
  type: 'join' | 'leave' | 'play' | 'pause' | 'seek' | 'chat' | 'sync';
  roomId: string;
  userId: string;
  userName?: string;
  data?: {
    currentTime?: number;
    isPlaying?: boolean;
    message?: string;
    participants?: Participant[];
  };
}

