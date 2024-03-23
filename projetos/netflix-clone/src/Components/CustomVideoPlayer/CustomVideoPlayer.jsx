import React, { useState, useRef, useEffect } from 'react';
import './CustomVideoPlayer.css'; // Importe o arquivo CSS para estilização

const CustomVideoPlayer = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isPaused, setIsPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoUrl) {
      const video = videoRef.current;
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('volumechange', handleVolumeChange);
      video.addEventListener('fullscreenchange', handleFullScreenChange);
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('volumechange', handleVolumeChange);
        video.removeEventListener('fullscreenchange', handleFullScreenChange);
      };
    }
  }, [videoUrl]);

  const handleUrlChange = (event) => {
    setVideoUrl(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aqui você pode adicionar lógica para validar o URL, se necessário
    // Por exemplo, verificar se o URL é válido e se corresponde a um vídeo suportado
  };

  const handleLoadedData = () => {
    setDuration(videoRef.current.duration);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleVolumeChange = () => {
    setVolume(videoRef.current.volume);
    setIsMuted(videoRef.current.muted);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    videoRef.current.muted = !isMuted;
  };

  const changeVolume = (value) => {
    videoRef.current.volume = value;
  };

  const formatDuration = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const skip = (duration) => {
    videoRef.current.currentTime += duration;
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) { /* Safari */
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) { /* IE11 */
        videoRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    }
  };

  const handleFullScreenChange = () => {
    setIsFullScreen(!!document.fullscreenElement || !!document.webkitFullscreenElement || !!document.msFullscreenElement);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={videoUrl} onChange={handleUrlChange} placeholder="Enter video URL" />
        <button type="submit">Load Video</button>
      </form>
      {videoUrl && (
        <div className="video-container">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            width="100%"
            height="auto"
            onClick={togglePlay}
          />
          <div className={`controls ${isPaused ? 'paused' : ''}`}>
            <button className="play-pause-btn" onClick={togglePlay}>{isPaused ? 'Play' : 'Pause'}</button>
            <button className="mute-btn" onClick={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</button>
            <input
              type="range"
              className="volume-slider"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
            />
            <span className="current-time">{formatDuration(currentTime)}</span>
            <span className="total-time">{formatDuration(duration)}</span>
            <button className="skip-btn" onClick={() => skip(-5)}>« 5s</button>
            <button className="skip-btn" onClick={() => skip(5)}>5s »</button>
            <button className="fullscreen-btn" onClick={toggleFullScreen}>{isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomVideoPlayer;
