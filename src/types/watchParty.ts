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
  type: 'join' | 'leave' | 'play' | 'pause' | 'seek' | 'chat' | 'sync' | 'create-room' | 'join-room' | 'leave-room';
  roomId: string;
  userId: string;
  userName?: string;
  movieId?: number;
  data?: {
    currentTime?: number;
    isPlaying?: boolean;
    message?: string;
    participants?: Participant[];
  };
}
