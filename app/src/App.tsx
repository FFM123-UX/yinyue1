import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import Player from '@/sections/Player';
import Playlist from '@/sections/Playlist';
import MVPlayer from '@/sections/MVPlayer';

function App() {
  const {
    audioRef,
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
  } = useAudioPlayer();

  return (
    <>
      {/* 隐藏音频元素 */}
      <audio
        ref={audioRef}
        src={currentSong.musicSrc}
        preload="metadata"
      />

      {/* 主播放器界面 */}
      <Player
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        playMode={playMode}
        playbackRate={playbackRate}
        currentSong={currentSong}
        formatTime={formatTime}
        togglePlay={togglePlay}
        nextSong={nextSong}
        prevSong={prevSong}
        togglePlayMode={togglePlayMode}
        setPlaybackRate={setPlaybackRate}
        toggleMute={toggleMute}
        handleVolumeChange={handleVolumeChange}
        handleSeek={handleSeek}
        setShowPlaylist={setShowPlaylist}
        setShowMV={setShowMV}
      />

      {/* 播放列表弹窗 */}
      {showPlaylist && (
        <Playlist
          currentIndex={currentIndex}
          isPlaying={isPlaying}
          playSong={playSong}
          onClose={() => setShowPlaylist(false)}
        />
      )}

      {/* MV播放器弹窗 */}
      {showMV && (
        <MVPlayer
          videoSrc={currentSong.videoSrc}
          isPlaying={isPlaying}
          currentTime={currentTime}
          playbackRate={playbackRate}
          onClose={() => setShowMV(false)}
        />
      )}
    </>
  );
}

export default App;
