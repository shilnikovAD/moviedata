import { describe, it, expect } from 'vitest';
import watchPartyReducer, {
  createRoom,
  joinRoom,
  leaveRoom,
  addParticipant,
  setPlaying,
  addMessage,
} from './watchPartySlice';
import type { WatchPartyState } from '../../types/watchParty';

describe('watchPartySlice', () => {
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

  it('should return the initial state', () => {
    expect(watchPartyReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle createRoom', () => {
    const actual = watchPartyReducer(
      initialState,
      createRoom({
        roomId: 'test123',
        movieId: 456,
        userId: 'user1',
        userName: 'John',
      })
    );

    expect(actual.roomId).toBe('test123');
    expect(actual.movieId).toBe(456);
    expect(actual.isHost).toBe(true);
    expect(actual.connected).toBe(true);
    expect(actual.participants).toHaveLength(1);
    expect(actual.participants[0].name).toBe('John');
  });

  it('should handle joinRoom', () => {
    const actual = watchPartyReducer(
      initialState,
      joinRoom({
        roomId: 'test456',
        movieId: 789,
        userId: 'user2',
        userName: 'Jane',
      })
    );

    expect(actual.roomId).toBe('test456');
    expect(actual.movieId).toBe(789);
    expect(actual.isHost).toBe(false);
    expect(actual.connected).toBe(true);
  });

  it('should handle leaveRoom', () => {
    const stateWithRoom = watchPartyReducer(
      initialState,
      createRoom({
        roomId: 'test123',
        movieId: 456,
        userId: 'user1',
        userName: 'John',
      })
    );

    const actual = watchPartyReducer(stateWithRoom, leaveRoom());

    expect(actual.roomId).toBeNull();
    expect(actual.isHost).toBe(false);
    expect(actual.connected).toBe(false);
    expect(actual.participants).toHaveLength(0);
    expect(actual.messages).toHaveLength(0);
  });

  it('should handle addParticipant', () => {
    const stateWithRoom = watchPartyReducer(
      initialState,
      createRoom({
        roomId: 'test123',
        movieId: 456,
        userId: 'user1',
        userName: 'John',
      })
    );

    const actual = watchPartyReducer(
      stateWithRoom,
      addParticipant({
        id: 'user2',
        name: 'Jane',
        isHost: false,
      })
    );

    expect(actual.participants).toHaveLength(2);
    expect(actual.participants[1].name).toBe('Jane');
  });

  it('should handle setPlaying', () => {
    const actual = watchPartyReducer(initialState, setPlaying(true));
    expect(actual.isPlaying).toBe(true);

    const actualPaused = watchPartyReducer(actual, setPlaying(false));
    expect(actualPaused.isPlaying).toBe(false);
  });

  it('should handle addMessage', () => {
    const message = {
      id: 'msg1',
      userId: 'user1',
      userName: 'John',
      message: 'Hello!',
      timestamp: Date.now(),
    };

    const actual = watchPartyReducer(initialState, addMessage(message));

    expect(actual.messages).toHaveLength(1);
    expect(actual.messages[0].message).toBe('Hello!');
  });

  it('should not add duplicate participants', () => {
    const stateWithParticipant = watchPartyReducer(
      initialState,
      addParticipant({
        id: 'user1',
        name: 'John',
        isHost: true,
      })
    );

    const actual = watchPartyReducer(
      stateWithParticipant,
      addParticipant({
        id: 'user1',
        name: 'John',
        isHost: true,
      })
    );

    expect(actual.participants).toHaveLength(1);
  });
});

