import { render, screen } from '@testing-library/react';
import { VideoPlayer } from './VideoPlayer';
import { describe, it, expect, vi } from 'vitest';

describe('VideoPlayer', () => {
  const mockOnPlayPause = vi.fn();

  it('renders demo mode when no video source is provided', () => {
    render(
      <VideoPlayer
        title="Test Movie"
        isPlaying={false}
        currentTime={0}
        onPlayPause={mockOnPlayPause}
      />
    );
    expect(screen.getByText(/Demo Mode/i)).toBeInTheDocument();
    expect(screen.getByText(/Simulating video playback/i)).toBeInTheDocument();
  });

  it('renders demo player with correct title', () => {
    render(
      <VideoPlayer
        title="Test Movie"
        isPlaying={false}
        currentTime={0}
        onPlayPause={mockOnPlayPause}
      />
    );
    expect(screen.getByText('🎬 Test Movie')).toBeInTheDocument();
  });

  it('renders play button in demo mode', () => {
    render(
      <VideoPlayer
        title="Test Movie"
        isPlaying={false}
        currentTime={0}
        onPlayPause={mockOnPlayPause}
      />
    );
    const playButton = screen.getByText(/▶️ Play/i);
    expect(playButton).toBeInTheDocument();
  });

  it('renders pause button when playing', () => {
    render(
      <VideoPlayer
        title="Test Movie"
        isPlaying={true}
        currentTime={10}
        onPlayPause={mockOnPlayPause}
      />
    );
    const pauseButton = screen.getByText(/⏸️ Pause/i);
    expect(pauseButton).toBeInTheDocument();
  });
});
