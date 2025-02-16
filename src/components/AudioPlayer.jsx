import React, { useRef, useState, useEffect } from 'react';
import './AudioPlayer.css'; // Import CSS for styling

const AudioPlayer = ({ audioSrc }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
      setCurrentTime(audio.currentTime);
    };

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const handleAudioEnd = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleAudioEnd);

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleAudioEnd);
    };
  }, []);

  // Play/Pause Toggle
  const togglePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Seek Bar Control
  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  // Volume Control
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  // Playback Speed Control
  const handleSpeedChange = (e) => {
    const newSpeed = e.target.value;
    audioRef.current.playbackRate = newSpeed;
    setPlaybackSpeed(newSpeed);
  };

  // Format time helper function
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={audioSrc} />

      {/* Controls */}
      <div className="controls">
        {/* Play/Pause Button */}
        <button className="play-pause-btn" onClick={togglePlayPause}>
          {isPlaying ? '⏸ Pause' : '▶️ Play'}
        </button>

        {/* Time Display */}
        <span className="time-display">{formatTime(currentTime)} / {formatTime(duration)}</span>

        {/* Seek Bar */}
        <input type="range" min="0" max="100" value={progress} onChange={handleSeek} className="seek-bar" />
      </div>

      {/* Volume & Speed Controls */}
      <div className="extra-controls">
        {/* Volume Control */}
        <div className="volume-control">
          <label>🔊 Volume</label>
          <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} />
        </div>

        {/* Speed Control */}
        <div className="speed-control">
          <label>⚡ Speed</label>
          <select value={playbackSpeed} onChange={handleSpeedChange}>
            <option value="0.5">0.5x</option>
            <option value="1">1x (Normal)</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
