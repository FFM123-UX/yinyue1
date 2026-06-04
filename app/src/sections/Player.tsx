import { useState, useRef } from 'react';
import type { PlaybackRate, PlayMode } from '@/types';

interface PlayerProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playMode: PlayMode;
  playbackRate: PlaybackRate;
  currentSong: {
    title: string;
    artist: string;
    cover: string;
    bg: string;
  };
  formatTime: (time: number) => string;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  togglePlayMode: () => void;
  setPlaybackRate: (rate: PlaybackRate) => void;
  toggleMute: () => void;
  handleVolumeChange: (v: number) => void;
  handleSeek: (t: number) => void;
  setShowPlaylist: (v: boolean) => void;
  setShowMV: (v: boolean) => void;
}

const modeIcons: Record<PlayMode, string> = {
  'single-loop': '/assets/mode1.png',
  'random': '/assets/mode2.png',
  'list-loop': '/assets/mode3.png',
};

const modeLabels: Record<PlayMode, string> = {
  'single-loop': '单曲循环',
  'random': '随机播放',
  'list-loop': '列表循环',
};

const playbackRates: PlaybackRate[] = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function Player({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  playMode,
  playbackRate,
  currentSong,
  formatTime,
  togglePlay,
  nextSong,
  prevSong,
  togglePlayMode,
  setPlaybackRate,
  toggleMute,
  handleVolumeChange,
  handleSeek,
  setShowPlaylist,
  setShowMV,
}: PlayerProps) {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // 进度条点击
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    handleSeek(ratio * duration);
  };

  // 音量滑块显示控制
  const handleVolumeEnter = () => {
    if (volumeTimerRef.current) clearTimeout(volumeTimerRef.current);
    setShowVolumeSlider(true);
  };

  const handleVolumeLeave = () => {
    volumeTimerRef.current = setTimeout(() => setShowVolumeSlider(false), 500);
  };

  return (
    <div
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{ fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif" }}
    >
      {/* 背景图 */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: `url(${currentSong.bg})`,
        }}
      />
      {/* 背景模糊遮罩 */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />

      {/* 主播放器卡片 */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-8 py-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl max-w-md w-full mx-4">

        {/* 唱片封面 */}
        <div className="relative">
          <div
            className={`w-56 h-56 rounded-full border-4 border-white/30 shadow-xl overflow-hidden ${
              isPlaying ? 'animate-spin-slow' : ''
            }`}
            style={{
              animationPlayState: isPlaying ? 'running' : 'paused',
            }}
          >
            <img
              src={currentSong.cover}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          </div>
          {/* 中心唱片孔 */}
          <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-black/60 rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-white/40" />
        </div>

        {/* 歌曲信息 */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
            {currentSong.title}
          </h2>
          <p className="text-white/70 text-base">{currentSong.artist}</p>
        </div>

        {/* 进度条 */}
        <div className="w-full space-y-2">
          <div
            ref={progressRef}
            className="relative w-full h-2 bg-white/20 rounded-full cursor-pointer group"
            onClick={handleProgressClick}
          >
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-100"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="flex justify-between text-xs text-white/60">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* 控制按钮区 */}
        <div className="flex items-center gap-5">
          {/* 播放模式 */}
          <button
            onClick={togglePlayMode}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/20 transition-all"
            title={modeLabels[playMode]}
          >
            <img src={modeIcons[playMode]} alt={modeLabels[playMode]} className="w-6 h-6 invert" />
          </button>

          {/* 上一首 */}
          <button
            onClick={prevSong}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/20 transition-all"
          >
            <img src="/assets/上一首.png" alt="上一首" className="w-7 h-7 invert" />
          </button>

          {/* 播放/暂停 */}
          <button
            onClick={togglePlay}
            className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg hover:scale-105 transition-all"
          >
            <img
              src={isPlaying ? '/assets/暂停.png' : '/assets/继续播放.png'}
              alt={isPlaying ? '暂停' : '播放'}
              className="w-9 h-9 invert"
            />
          </button>

          {/* 下一首 */}
          <button
            onClick={nextSong}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/20 transition-all"
          >
            <img src="/assets/下一首.png" alt="下一首" className="w-7 h-7 invert" />
          </button>

          {/* 倍速按钮 */}
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/20 transition-all text-white text-xs font-bold"
              title="播放速度"
            >
              {playbackRate}x
            </button>
            {showSpeedMenu && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/80 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden shadow-2xl">
                {playbackRates.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => {
                      setPlaybackRate(rate);
                      setShowSpeedMenu(false);
                    }}
                    className={`block w-full px-4 py-2 text-sm text-white hover:bg-white/20 transition-all ${
                      playbackRate === rate ? 'bg-cyan-500/50 font-bold' : ''
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 底部功能栏 */}
        <div className="flex items-center justify-between w-full pt-2">
          {/* 音量控制 */}
          <div
            className="relative flex items-center gap-2"
            onMouseEnter={handleVolumeEnter}
            onMouseLeave={handleVolumeLeave}
          >
            <button
              onClick={toggleMute}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-all"
            >
              <img
                src={isMuted ? '/assets/静音.png' : '/assets/音量.png'}
                alt="音量"
                className="w-5 h-5 invert"
              />
            </button>
            {showVolumeSlider && (
              <div className="absolute left-full ml-1 w-24 h-8 flex items-center bg-black/60 backdrop-blur-xl rounded-full px-2">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-1 accent-cyan-400 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* 右侧功能按钮 */}
          <div className="flex items-center gap-2">
            {/* 播放列表 */}
            <button
              onClick={() => setShowPlaylist(true)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-all"
              title="播放列表"
            >
              <img src="/assets/列表.png" alt="列表" className="w-5 h-5 invert" />
            </button>

            {/* MV按钮 */}
            <button
              onClick={() => setShowMV(true)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-all"
              title="MV"
            >
              <img src="/assets/MV.png" alt="MV" className="w-5 h-5 invert" />
            </button>
          </div>
        </div>

        {/* 个人水印 */}
        <div className="mt-1 text-center">
          <span className="text-[10px] text-white/20 tracking-widest select-none">
            24215220205 范籽雯
          </span>
        </div>
      </div>
    </div>
  );
}
