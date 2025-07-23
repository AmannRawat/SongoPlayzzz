import React, { useRef, useEffect, useState } from "react";
import "./Playbar.css";

let YT;

const Playbar = ({ videoId, isPlaying, trackDuration, onPlayToggle }) => {
  const playerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [player, setPlayer] = useState(null);

  // Load YT Iframe API
  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    window.onYouTubeIframeAPIReady = () => {
      YT = window.YT;
      const newPlayer = new YT.Player("yt-player", {
        height: "0",
        width: "0",
        videoId: videoId,
        playerVars: { autoplay: 1 },
        events: {
          onReady: (event) => {
            event.target.playVideo();
            setDuration(event.target.getDuration());
          },
        },
      });
      setPlayer(newPlayer);
    };
    document.body.appendChild(tag);
  }, [videoId]);

  // Track playback progress
  useEffect(() => {
    let interval;
    if (player && isPlaying) {
      interval = setInterval(() => {
        const current = player.getCurrentTime();
        const total = player.getDuration();
        setProgress((current / total) * 100);
        setDuration(total);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [player, isPlaying]);

  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
    onPlayToggle(); // tell parent to toggle
  };

  const handleSeek = (e) => {
    if (!player) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickPercent = clickX / width;
    player.seekTo(clickPercent * duration);
  };

  return (
    <div className="playbar">
      {/* Hidden YouTube player */}
      <div id="yt-player"></div>

      <div className="controls">
        <div className="comp">
          <img
            id="pre"
            src="/assets/previos.svg"
            alt="Previous"
            onClick={() => alert("Previous (coming soon!)")}
          />
          <div>
            <img
              id="play"
              src={isPlaying ? "/assets/pause.svg" : "/assets/play.svg"}
              alt={isPlaying ? "Pause" : "Play"}
              onClick={togglePlay}
              style={{ cursor: "pointer" }}
            />
          </div>
          <img
            id="next"
            src="/assets/next.svg"
            alt="Next"
            onClick={() => alert("Next (coming soon!)")}
          />
        </div>

        <div className="track-info">
          <img src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`} alt="Track Thumbnail" />
          <div>
            <p className="track-title">{player?.getVideoData?.().title || "Now Playing"}</p>
            <p className="track-channel">{player?.getVideoData?.().author || "Artist"}</p>
          </div>
        </div>

        <div className="seekbar" onClick={handleSeek}>
          <div className="slider" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default Playbar;
