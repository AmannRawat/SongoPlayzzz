import React, { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import "./Playbar.css";

// This is now a "controlled component". It receives all its data and functions as props from App.jsx.
const Playbar = ({
  currentSong,
  isPlaying,
  duration,
  progress,
  volume,
  setDuration,
  setProgress,
  setIsPlaying,
  togglePlayPause,
  onPlayNext,
  onPlayPrev,
  handleProgressBarChange,
  setVolume,
}) => {
  const audioRef = useRef(null);
  const playerRef = useRef(null); // For YouTube player
  const [isMuted, setIsMuted] = useState(false);
  const seekbarRef = useRef(null);
  const isSeeking = useRef(false);

  if (!currentSong) {
    return null; // Don't render anything if there's no song
  }
  // A single, robust useEffect to handle all playback logic for local and YouTube
  useEffect(() => {
    const isYoutube = currentSong?.source === 'youtube';
    const isLocal = currentSong?.source === 'local';

    // --- Logic for LOCAL songs ---
    if (isLocal && audioRef.current) {
      if (audioRef.current.src !== currentSong.url) {
        audioRef.current.src = currentSong.url;
      }
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play error:", e));
      } else {
        audioRef.current.pause();
      }
    }

    // --- Logic for YOUTUBE songs ---
    // (1) ADDED A GUARD CLAUSE here to match the JSX
    if (isYoutube && playerRef.current && currentSong.id?.videoId) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }

    // (2) ADDED A CLEANUP FUNCTION to prevent race conditions
    // This function runs BEFORE the effect runs again, or when the component unmounts.
    return () => {
      if (isLocal && audioRef.current) {
        audioRef.current.pause(); // Pause the local player when switching
      }
      if (isYoutube && playerRef.current) {
        playerRef.current.pauseVideo(); // Pause the YouTube player when switching
      }
    };
  }, [currentSong, isPlaying]); // The dependencies are what trigger this effect to run.

  // Effect to handle volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    if (playerRef.current) {
      playerRef.current.setVolume(volume * 100);
    }
  }, [volume]);

  // Effect to handle seeking from parent
  useEffect(() => {
    if (isSeeking.current) return; // Don't seek if the user is dragging

    const isYoutube = currentSong?.source === 'youtube';
    const isLocal = currentSong?.source === 'local';

    if (isYoutube && playerRef.current) {
      const ytCurrentTime = playerRef.current.getCurrentTime();
      if (Math.abs(ytCurrentTime - progress) > 1.5) {
        playerRef.current.seekTo(progress, true);
      }
    }
    if (isLocal && audioRef.current) {
      const diff = Math.abs(audioRef.current.currentTime - progress);
      if (diff > 1) {
        audioRef.current.currentTime = progress;
      }
    }
  }, [progress]);

  // YouTube Player options
  const youtubeOpts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
      controls: 0,
    },
  };

  // YouTube event handlers
  const onYoutubeReady = (event) => {
    playerRef.current = event.target;
    setDuration(playerRef.current.getDuration());
  };

  const onYoutubeStateChange = (event) => {
    if (event.data === 1) { // Playing
      setIsPlaying(true);
      setDuration(playerRef.current.getDuration());
    } else if (event.data === 2) { // Paused
      setIsPlaying(false);
    } else if (event.data === 0) { // Ended
      onPlayNext();
    }
  };

  // Effect to handle YouTube progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Only update if a YouTube song is playing and the user is not dragging
      if (isPlaying && currentSong?.source === 'youtube' && playerRef.current && !isSeeking.current) {
        setProgress(playerRef.current.getCurrentTime());
      }
    }, 500); // Update every half second

    // Clear the interval when the component unmounts or dependencies change
    return () => clearInterval(interval);
  }, [isPlaying, currentSong, setProgress]);

  // Helper to format time
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds === 0) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Effect to handle seekbar dragging logic
  useEffect(() => {
    const seekbar = seekbarRef.current;
    if (!seekbar) return;

    const calculateNewProgress = (e) => {
      if (duration > 0) {
        const rect = seekbar.getBoundingClientRect();
        const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
        const clickX = clientX - rect.left;
        const width = rect.width;
        const newProgress = (clickX / width) * duration;
        return Math.max(0, Math.min(newProgress, duration));
      }
      return null;
    };

    const handleDown = (e) => {
      isSeeking.current = true;
      const newProgress = calculateNewProgress(e);
      if (newProgress !== null) {
        setProgress(newProgress);
      }

      const handleMove = (moveEvent) => {
        if (isSeeking.current) {
          const movedProgress = calculateNewProgress(moveEvent);
          if (movedProgress !== null) {
            setProgress(movedProgress);
          }
        }
      };

      const handleUp = (upEvent) => {
        if (isSeeking.current) {
          const finalProgress = calculateNewProgress(upEvent);
          if (finalProgress !== null) {
            const isYoutube = currentSong?.source === 'youtube';
            const isLocal = currentSong?.source === 'local';

            // This is the core fix: tell the media player to seek to the new position.
            if (isYoutube && playerRef.current) {
              playerRef.current.seekTo(finalProgress, true);
            }
            if (isLocal && audioRef.current) {
              audioRef.current.currentTime = finalProgress;
            }
            // Update the state to the final position.
            setProgress(finalProgress);
          }
          isSeeking.current = false;
        }
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleUp);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleUp);
      };

      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('touchend', handleUp);
    };

    seekbar.addEventListener('mousedown', handleDown);
    seekbar.addEventListener('touchstart', handleDown);

    return () => {
      seekbar.removeEventListener('mousedown', handleDown);
      seekbar.removeEventListener('touchstart', handleDown);
    };
  }, [duration, handleProgressBarChange, setProgress]);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setIsMuted(newVolume === 0);
    setVolume(newVolume);
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    setVolume(newMutedState ? 0 : 0.5);
  };


  return (
    <div className="playbar">
      {currentSong?.source === 'local' && (
        <audio
          ref={audioRef}
          src={currentSong.url}
          // onLoadedMetadata={() => setDuration(audioRef.current.duration)}
          onLoadedMetadata={() => {
            setDuration(audioRef.current.duration);
            // audioRef.current.play().catch(e => console.error("Audio play error:", e));
          }}
          onTimeUpdate={() => {
            if (!isSeeking.current) { // Only update progress if user is not seeking
              setProgress(audioRef.current.currentTime);
            }
          }}
          onEnded={onPlayNext}
          onError={(e) => console.error("Audio Error:", e)}
        // autoPlay={isPlaying}
        />
      )}
      {currentSong?.source === 'youtube' && currentSong.id?.videoId && (
        <YouTube
          videoId={currentSong.id.videoId}
          opts={youtubeOpts}
          onReady={onYoutubeReady}
          onStateChange={onYoutubeStateChange}
          onError={(e) => console.error("YouTube Error:", e)}
          className="youtube-player"
        />
      )}

      <div className="track-info">
        <img src={currentSong.thumbnail} alt="Thumbnail" />
        <div>
          <p className="track-title">{currentSong.title || "Unknown Title"}</p>
          <p className="track-channel">{currentSong.artist || "Unknown Artist"}</p>
        </div>
      </div>

      <div className="controls-and-seek">
        <div className="controls">
          <img src="/assets/previos.svg" alt="Previous" onClick={onPlayPrev} />
          <img
            src={isPlaying ? "/assets/pause.svg" : "/assets/play.svg"}
            alt="Play/Pause"
            onClick={togglePlayPause}
          />
          <img src="/assets/next.svg" alt="Next" onClick={onPlayNext} />
        </div>
        <div className="seek-container">
          <span className="time-label">{formatTime(progress)}</span>
          <div className="seekbar" ref={seekbarRef}>
            <div
              className="slider"
              style={{ width: `${(progress / duration) * 100 || 0}%` }}
            ></div>
          </div>
          <span className="time-label">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="volume-control">
        <span className="volume-label">Volume :</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          style={{ '--val': volume * 100 }}
        />
        <img
          src={isMuted ? "/assets/mute.svg" : "/assets/volume.svg"}
          alt="Mute/Unmute"
          onClick={toggleMute}
          style={{ width: "24px", height: "24px", cursor: "pointer" }}
        />
      </div>
    </div>
  );
};

export default Playbar;
