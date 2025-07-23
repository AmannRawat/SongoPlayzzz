import React, { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';

const AudioPlayer = ({ videoId, onPlayStateChange, onTrackDuration }) => {
  const playerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
    },
  };

  const handleReady = (event) => {
    playerRef.current = event.target;
    setIsReady(true);
    onTrackDuration?.(event.target.getDuration());
    event.target.playVideo();
  };

  const handleStateChange = (event) => {
    const state = event.data;
    if (state === window.YT?.PlayerState.PLAYING) {
      onPlayStateChange?.(true);
    } else if (
      state === window.YT?.PlayerState.PAUSED ||
      state === window.YT?.PlayerState.ENDED
    ) {
      onPlayStateChange?.(false);
    }
  };

  useEffect(() => {
    if (!isReady || !playerRef.current) return;

    window.audioPlayerControls = {
      play: () => playerRef.current.playVideo(),
      pause: () => playerRef.current.pauseVideo(),
      next: () => {}, // add logic if needed
      prev: () => {},
      seekTo: (sec) => playerRef.current.seekTo(sec, true),
      getCurrentTime: () => playerRef.current.getCurrentTime(),
    };
  }, [isReady]);

  return (
    <div style={{ position: 'absolute', left: '-9999px' }}>
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={handleReady}
        onStateChange={handleStateChange}
      />
    </div>
  );
};

export default AudioPlayer;
