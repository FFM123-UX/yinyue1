import { useEffect, useRef } from 'react';

interface MVPlayerProps {
  videoSrc: string;
  isPlaying: boolean;
  currentTime: number;
  playbackRate: number;
  onClose: () => void;
}

export default function MVPlayer({
  videoSrc,
  isPlaying,
  currentTime,
  playbackRate,
  onClose,
}: MVPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = videoSrc;
    video.currentTime = currentTime;
    video.playbackRate = playbackRate;
    video.muted = true;

    if (isPlaying) {
      video.play().catch(() => {});
    }
  }, [videoSrc, playbackRate]);

  // 同步播放状态
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying && video.paused) {
      video.play().catch(() => {});
    } else if (!isPlaying && !video.paused) {
      video.pause();
    }
  }, [isPlaying]);

  // 同步进度
  useEffect(() => {
    const video = videoRef.current;
    if (!video || Math.abs(video.currentTime - currentTime) < 1) return;
    video.currentTime = currentTime;
  }, [currentTime]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl">
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all text-white text-xl"
      >
        &times;
      </button>

      {/* 视频 */}
      <video
        ref={videoRef}
        className="w-full h-full max-w-5xl max-h-[80vh] object-contain"
        playsInline
        loop={false}
      />

      {/* 标题 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        MV 播放中
      </div>
    </div>
  );
}
