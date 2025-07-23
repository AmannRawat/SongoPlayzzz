// import React from "react";
import "./SongCard.css"; // your styles

const SongCard = ({ css, imgSrc, title, artist, onPlay }) => {
  return (
    <div className="card1">
      <div className={css}>
        <img src={imgSrc} alt="artist" />
      </div>
      <div className="greenbtn songbtn" onClick={onPlay}>
        <svg width="55" height="55" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="#1ed760" />
          <polygon points="40,30 40,70 70,50" fill="black" />
        </svg>
      </div>
      <h3>{title}</h3>
      <p>{artist}</p>
    </div>
  );
};

export default SongCard;
