import React, { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import "./Playbar.css";
// import { ReactComponent as PauseIcon } from '/assets/pause.svg';

const Playbar = ({
  results,
  selectedIndex,
  setSelectedIndex,
  currentSong,
  setCurrentSong,
  handleNextLocalSong,
  isPlaying,
  setIsPlaying,
  trackDuration,
  setTrackDuration,
  onPlayToggle,
}) => {
  const audioRef = useRef(null);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isDragging, setIsDragging] = React.useState(false);
  const seekbarRef = useRef(null);
  const [isMuted, setIsMuted] = React.useState(false);


  useEffect(() => {
    console.log("🎧 currentSong: ", currentSong);
  }, [currentSong]);

  const currentVideo = selectedIndex !== null ? results[selectedIndex] : null;
  // const isLocal = !!currentSong;
  // const isLocal = currentSong?.src?.startsWith("http") && currentSong?.src?.endsWith(".mp3");
  const isLocal = currentSong?.src?.endsWith(".mp3");
  // const isLocal = currentSong?.type === "local";

 const videoId = currentVideo?.id || currentSong?.videoId || null;

  const opts = {
    height: "0",
    width: "0",
    playerVars: { autoplay: 1, controls: 0, modestbranding: 1 },
  };

  const onReady = (event) => {
    playerRef.current = event.target;
    event.target.setVolume(volume);
    event.target.playVideo();
  };

  const onStateChange = (event) => {
    const state = event.data;
    if (state === window.YT?.PlayerState.PLAYING) {
      setIsPlaying(true);
      const dur = playerRef.current?.getDuration();
      if (dur && dur !== trackDuration) {
        setTrackDuration(dur);
      }
    } else if (
      state === window.YT?.PlayerState.PAUSED ||
      state === window.YT?.PlayerState.ENDED
    ) {
      setIsPlaying(false);
    }

    // Auto play next on END
    if (state === window.YT?.PlayerState.ENDED) {
      playNext();
    }
  };

  const togglePlay = () => {
    if (isLocal) {
      if (!audioRef.current) return;
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
    } else {
      if (!playerRef.current) return;
      isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
    }
    onPlayToggle?.();
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleSeek = (e) => {
    const rect = seekbarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const seekTime = (clickX / width) * trackDuration;

    if (isLocal) {
      audioRef.current.currentTime = seekTime;
    } else {
      playerRef.current?.seekTo(seekTime, true);
    }

    setProgress((clickX / width) * 100);
  };


  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const rect = seekbarRef.current.getBoundingClientRect();
    const moveX = e.clientX - rect.left;
    const width = rect.width;
    const seekTime = Math.max(0, Math.min(moveX / width, 1)) * trackDuration;
    playerRef.current?.seekTo(seekTime, true);
    setProgress((moveX / width) * 100);
  };

  const toggleMute = () => {
    if (isLocal) {
      if (!audioRef.current) return;
      audioRef.current.muted = !audioRef.current.muted;
    } else {
      if (!playerRef.current) return;
      isMuted ? playerRef.current.unMute() : playerRef.current.mute();
    }
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      if (total) {
        setProgress((current / total) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setTrackDuration(audioRef.current.duration);
    }
  };

  const handleVolume = (e) => {
    const newVol = parseInt(e.target.value);
    setVolume(newVol);
    e.target.style.setProperty('--val', newVol);

    if (isLocal) {
      if (audioRef.current) audioRef.current.volume = newVol / 100;
    } else {
      playerRef.current?.setVolume(newVol);
    }
  };


  const playNext = () => {
    if (selectedIndex + 1 < results.length) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const playPrevious = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  useEffect(() => {
    if (playerRef.current && videoId) {
      playerRef.current.loadVideoById(videoId);
    }
  }, [videoId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isLocal && audioRef.current && isPlaying) {
        const current = audioRef.current.currentTime;
        const total = audioRef.current.duration;
        if (total) setProgress((current / total) * 100);
      } else if (playerRef.current && isPlaying) {
        const current = playerRef.current.getCurrentTime();
        const total = playerRef.current.getDuration();
        if (total) setProgress((current / total) * 100);
      }
    }, 1000);

    intervalRef.current = interval;
    return () => clearInterval(interval);
  }, [isPlaying, isLocal]);

  if (!currentVideo && !currentSong) return null;

  return (
    <div className="playbar">
      {isLocal ? (
        <audio
          ref={audioRef}
          // src={localSong.src}
          src={currentSong?.src || `https://www.youtube.com/watch?v=${currentSong?.videoId}`} // or your existing logic
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleNextLocalSong}
        />
      ) : (
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onReady}
          onStateChange={onStateChange}
        />
      )}

      <div className="track-info">
        <img
          src={
            isLocal
              ? currentSong.thumbnail
              : `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`
          }
          alt="Thumbnail"
        />
        <div>
          <p className="track-title">
            {isLocal
              ? currentSong?.title
              : currentVideo?.snippet?.title || currentSong?.title || "Unknown Title"}
          </p>

          <p className="track-channel">
            {isLocal
              ? currentSong?.artist
              : currentVideo?.snippet?.channelTitle || currentSong?.artist || "Unknown Artist"}
          </p>
        </div>
      </div>

      <div className="controls-and-seek">
        <div className="controls">
          <img src="/assets/previos.svg" alt="Previous" onClick={playPrevious} />
          <img
            src={isPlaying ? "/assets/pause.svg" : "/assets/play.svg"}
            alt="Play/Pause"
            onClick={togglePlay}
          />
          <img src="/assets/next.svg" alt="Next" onClick={playNext} />
        </div>

        <div
          className="seekbar"
          ref={seekbarRef}
          onClick={handleSeek}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="slider" style={{ width: `${progress}%` }}></div>
        </div>

      </div>


      <div className="volume-control">
        <span className="volume-label">Volume :</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolume}
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
