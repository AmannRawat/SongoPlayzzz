// import React from 'react';
import './sidebar.css';

function Sidebar({ onSectionChange }) {
  return (
    <div className="sidebar">
      <div className="logo-box">
        <div className="logo">
          <img src="/assets/LOGO.jpg" alt="Logo" />
          <span>SongoPlayz</span>
        </div>
        <div className="HS">
          <div className="home" onClick={() => onSectionChange("home")}>
            <img src="/assets/home.svg" alt="Home" />
            <span>Home</span>
          </div>
          <div className="search" onClick={() => onSectionChange("search")}>
            <img src="/assets/search.svg" alt="Search" />
            <span>Search</span>
          </div>
        </div>
      </div>

      <div className="library">
        <div className="playlist" onClick={() => onSectionChange("library")}>
          <img src="/assets/playlist.svg" alt="Library" />
          <span>Your Library</span>
        </div>
        
        {/* --- CARD #1: MADE THE WHOLE DIV CLICKABLE --- */}
        <div className="boxes" onClick={() => onSectionChange("library")}>
          <h3>My Playlist</h3>
          <h4>Here Check your personalised playlist</h4>
          {/* The <button> has been removed */}
        </div>
        
        {/* --- CARD #2: WRAPPED THE WHOLE DIV IN AN <a> TAG --- */}
        <a href="https://songoplayz.netlify.app/" target="_blank" rel="noreferrer" className="box-link">
          <div className="boxes">
            <h3>Old Version</h3>
            <h4>This is Older version of SongoPlayzz</h4>
            {/* The <button> has been removed */}
          </div>
        </a>
        <div className="lib-footer">
          <div><a href="/"><span>Legal</span></a></div>
          <div><a href="/"><span>Privacy Policy</span></a></div>
          <div><a href="/"><span>Cookies</span></a></div>
          <div><a href="/"><span>About Ads</span></a></div>
          {/* <span>© 2025</span> */}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
