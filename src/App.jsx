import React, { useState ,useEffect, useRef } from "react";
import './App.css';
// import Navbar from './components/Navbar';
import Sidebar from './components/sidebar';
import Content from './components/Content';
import Playbar from './components/Playbar';
import BottomNav from './components/BottomNav'; 

function App() {
  const [currentSection, setCurrentSection] = useState("home");
  // START: Music Playback State and Ref 
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5); // Initial volume
  const [currentPlaylist, setCurrentPlaylist] = useState([]); // Array of song objects
  const [currentSongIndex, setCurrentSongIndex] = useState(0); // Index of current song in playlist
  // END: Music Playback State and Ref

  // Function to toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Function to play the next song in the playlist
  const playNextSong = () => {
    if (currentPlaylist.length === 0) return; // No playlist
    let nextIndex = currentSongIndex + 1;
    if (nextIndex >= currentPlaylist.length) {
      nextIndex = 0; // Loop to the beginning
    }
    setCurrentSongIndex(nextIndex);
    setCurrentSong(currentPlaylist[nextIndex]);
    setIsPlaying(true); // Start playing the next song automatically
  };

  // Function to play the previous song in the playlist
  const playPrevSong = () => {
    if (currentPlaylist.length === 0) return; // No playlist
    let prevIndex = currentSongIndex - 1;
    if (prevIndex < 0) {
      prevIndex = currentPlaylist.length - 1; // Loop to the end
    }
    setCurrentSongIndex(prevIndex);
    setCurrentSong(currentPlaylist[prevIndex]);
    setIsPlaying(true); // Start playing the previous song automatically
  };

  // Handler for progress bar change
  const handleProgressBarChange = (e) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    // The Playbar component will be responsible for seeking the actual audio/video
  };
  // END: Music Playback Functions

  return (
    <div className="main-layout">
      <Sidebar onSectionChange={setCurrentSection} />
      <div className="Content">
        {/* <Navbar /> */}
        <Content section={currentSection} 
        // Pass down setters for Content to update App's state
          setCurrentSong={setCurrentSong}
          setIsPlaying={setIsPlaying}
          setCurrentPlaylist={setCurrentPlaylist}
          setCurrentSongIndex={setCurrentSongIndex}/>
             {currentSong && ( // Only show playbar if a song is loaded
          <Playbar
            currentSong={currentSong}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying} // Pass down the setter
            volume={volume}
            setVolume={setVolume}
            progress={progress}
            setProgress={setProgress} // Pass down the setter
            duration={duration}
            setDuration={setDuration} // Pass down the setter
            togglePlayPause={togglePlayPause}
            handleProgressBarChange={handleProgressBarChange}
            onPlayNext={playNextSong} // Pass the new functions
            onPlayPrev={playPrevSong} // Pass the new functions
          />
        )}
      </div>
        <BottomNav onSectionChange={setCurrentSection} />
    </div>
  );

}

export default App;
