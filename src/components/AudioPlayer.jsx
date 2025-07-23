// Updated AudioPlayer.jsx
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

  const onReady = (event) => {
    playerRef.current = event.target;
    setIsReady(true);
    onTrackDuration?.(event.target.getDuration());
    event.target.playVideo();
  };

  const onStateChange = (event) => {
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
    if (playerRef.current) {
      playerRef.current.cueVideoById(videoId);
    }
  }, [videoId]);

  return (
    <div style={{ position: 'absolute', left: '-9999px' }}>
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
      />
    </div>
  );
};

export default AudioPlayer;



  { /*Way to add <AudioPlayer
        videoId={selectedVideoId}
        onPlayStateChange={(isPlaying) => setIsPlaying(isPlaying)}
        onTrackDuration={(duration) => setTrackDuration(duration)}
      /> */}