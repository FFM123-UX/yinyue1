import { useState, useRef, useEffect, useCallback } from 'react';
import type { PlayMode, PlaybackRate } from '@/types';
import { songs } from '@/data/songs';

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>('list-loop');
  const [playbackRate, setPlaybackRateState] = useState<PlaybackRate>(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showMV, setShowMV] = useState(false);

  const currentSong = songs[currentIndex];

  // 时间格式化
  const formatTime = useCallback((time: number) => {
    if (isNaN(time)) return '00:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

  // 播放/暂停
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      videoRef.current?.pause();
    } else {
      audioRef.current.play();
      if (showMV && videoRef.current) {
        videoRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, showMV]);

  // 播放指定歌曲
  const playSong = useCallback((index: number) => {
    setCurrentIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
    // 使用setTimeout确保DOM更新后再播放
    setTimeout(() => {
      audioRef.current?.play();
      if (showMV && videoRef.current) {
        videoRef.current.play();
      }
    }, 100);
  }, [showMV]);

  // 下一首
  const nextSong = useCallback(() => {
    let nextIndex: number;
    if (playMode === 'random') {
      nextIndex = Math.floor(Math.random() * songs.length);
    } else if (playMode === 'single-loop') {
      nextIndex = currentIndex;
      audioRef.current?.play();
      if (showMV && videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
      setCurrentTime(0);
      return;
    } else {
      nextIndex = (currentIndex + 1) % songs.length;
    }
    playSong(nextIndex);
  }, [playMode, currentIndex, playSong, showMV]);

  // 上一首
  const prevSong = useCallback(() => {
    let prevIndex: number;
    if (playMode === 'random') {
      prevIndex = Math.floor(Math.random() * songs.length);
    } else {
      prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    }
    playSong(prevIndex);
  }, [playMode, currentIndex, playSong]);

  // 切换播放模式
  const togglePlayMode = useCallback(() => {
    const modes: PlayMode[] = ['list-loop', 'single-loop', 'random'];
    const currentIdx = modes.indexOf(playMode);
    setPlayMode(modes[(currentIdx + 1) % modes.length]);
  }, [playMode]);

  // 设置倍速
  const setPlaybackRate = useCallback((rate: PlaybackRate) => {
    setPlaybackRateState(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  }, []);

  // 切换静音
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  // 设置音量
  const handleVolumeChange = useCallback((newVolume: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      audioRef.current.muted = false;
    }
  }, [isMuted]);

  // 设置进度
  const handleSeek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    setCurrentTime(time);
  }, []);

  // 音频事件监听
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => nextSong();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [nextSong]);

  // 倍速同步
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate, currentIndex, showMV]);

  return {
    // refs
    audioRef,
    videoRef,
    // state
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playMode,
    playbackRate,
    currentIndex,
    currentSong,
    showPlaylist,
    showMV,
    // actions
    setShowPlaylist,
    setShowMV,
    togglePlay,
    playSong,
    nextSong,
    prevSong,
    togglePlayMode,
    setPlaybackRate,
    toggleMute,
    handleVolumeChange,
    handleSeek,
    formatTime,
  };
}
