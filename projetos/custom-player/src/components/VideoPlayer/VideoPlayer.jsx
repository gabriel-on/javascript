import React, { useRef, useState, useEffect } from 'react';
import './VideoPlayer.css';

const VideoPlayer = () => {
  const [videoSrc, setVideoSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef(null);
  const inputRef = useRef(null);
  const progressBarRef = useRef(null);
  const fullscreenRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setVideoSrc(videoURL);
    }
  };

  const playPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const updateTime = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const updateDuration = () => {
    setDuration(videoRef.current.duration);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = progressBarRef.current.clientWidth;
    const currentTime = (clickX / width) * duration;
    videoRef.current.currentTime = currentTime;
    setCurrentTime(currentTime);
  };

  const handleProgressDragStart = () => {
    videoRef.current.pause();
    setIsDragging(true);
  };

  const handleProgressDragEnd = () => {
    videoRef.current.play();
    setIsDragging(false);
  };

  const handleProgressDrag = (e) => {
    if (isDragging) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = progressBarRef.current.clientWidth;
      const currentTime = (clickX / width) * duration;
      if (currentTime >= 0 && currentTime <= duration) {
        videoRef.current.currentTime = currentTime;
        setCurrentTime(currentTime);
      }
    }
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (fullscreenRef.current.requestFullscreen) {
        fullscreenRef.current.requestFullscreen();
      } else if (fullscreenRef.current.webkitRequestFullscreen) {
        fullscreenRef.current.webkitRequestFullscreen();
      } else if (fullscreenRef.current.msRequestFullscreen) {
        fullscreenRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', updateTime);
      videoRef.current.addEventListener('durationchange', updateDuration);
      return () => {
        videoRef.current.removeEventListener('timeupdate', updateTime);
        videoRef.current.removeEventListener('durationchange', updateDuration);
      };
    }
  }, [videoSrc]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      handleProgressDrag(e);
    };

    const handleMouseUp = () => {
      handleProgressDragEnd();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
    };
  }, []);

  return (
    <div className="video-container">
      <input
        type="file"
        accept="video/*"
        ref={inputRef}
        onChange={handleFileChange}
      />
      <button onClick={() => inputRef.current.click()}>Select Video</button>
      <br />
      {videoSrc && (
        <div
          className={`custom-video ${isFullScreen ? 'fullscreen' : ''}`}
          ref={fullscreenRef}
          style={{
            maxWidth: isFullScreen ? '100vw' : '800px', // Definindo largura máxima condicionalmente
            maxHeight: isFullScreen ? '100vh' : 'auto', // Definindo altura máxima condicionalmente
            display: 'flex',
            justifyContent: 'center', // Centralizando horizontalmente
            alignItems: 'center', // Centralizando verticalmente
          }}
        >
          <video
            ref={videoRef}
            src={videoSrc}
            onTimeUpdate={updateTime}
            onEnded={() => setIsPlaying(false)}
          ></video>
          <div className="controls">
            <button onClick={playPause}>{isPlaying ? 'Pause' : 'Play'}</button>
            <span>{formatTime(currentTime)}</span>
            <div
              className="progress-bar"
              ref={progressBarRef}
              onClick={handleProgressClick}
              onMouseDown={handleProgressDragStart}
            >
              <div
                className="progress"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
            <span>{formatTime(duration)}</span>
            <button onClick={toggleFullScreen}>
              {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
