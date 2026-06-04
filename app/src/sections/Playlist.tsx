import { songs } from '@/data/songs';

interface PlaylistProps {
  currentIndex: number;
  isPlaying: boolean;
  playSong: (index: number) => void;
  onClose: () => void;
}

export default function Playlist({ currentIndex, isPlaying, playSong, onClose }: PlaylistProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* 列表面板 */}
      <div className="relative w-full max-w-md max-h-[60vh] bg-black/80 backdrop-blur-2xl rounded-t-3xl sm:rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col animate-slide-up">
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-white text-lg font-bold">播放列表</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-all text-white text-xl"
          >
            &times;
          </button>
        </div>

        {/* 歌曲列表 */}
        <div className="flex-1 overflow-y-auto">
          {songs.map((song, index) => (
            <div
              key={song.id}
              onClick={() => {
                playSong(index);
                onClose();
              }}
              className={`flex items-center gap-4 px-6 py-3 cursor-pointer transition-all hover:bg-white/10 ${
                index === currentIndex ? 'bg-white/15' : ''
              }`}
            >
              {/* 序号或播放动画 */}
              <div className="w-8 h-8 flex items-center justify-center">
                {index === currentIndex && isPlaying ? (
                  <div className="flex items-end gap-0.5 h-4">
                    <div className="w-1 bg-cyan-400 animate-music-bar-1" />
                    <div className="w-1 bg-cyan-400 animate-music-bar-2" />
                    <div className="w-1 bg-cyan-400 animate-music-bar-3" />
                  </div>
                ) : (
                  <span className="text-white/50 text-sm">{index + 1}</span>
                )}
              </div>

              {/* 封面 */}
              <img
                src={song.cover}
                alt={song.title}
                className="w-10 h-10 rounded-lg object-cover"
              />

              {/* 歌曲信息 */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  index === currentIndex ? 'text-cyan-400' : 'text-white'
                }`}>
                  {song.title}
                </p>
                <p className="text-white/50 text-xs truncate">{song.artist}</p>
              </div>

              {/* 当前播放标记 */}
              {index === currentIndex && (
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
