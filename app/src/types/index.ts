export interface Song {
  id: number;
  title: string;
  artist: string;
  musicSrc: string;
  videoSrc: string;
  cover: string;
  bg: string;
}

export type PlayMode = 'single-loop' | 'random' | 'list-loop';

export type PlaybackRate = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playMode: PlayMode;
  playbackRate: PlaybackRate;
  currentIndex: number;
  showPlaylist: boolean;
  showMV: boolean;
}
