import React, { useState } from 'react';
import './SearchPage.css';
import { searchSongs } from "../api/youtube";

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);


  const handleSearch = async () => {
    if (query.trim()) {
      const songs = await searchSongs(query);
      setResults(songs);
    }
  };

  
  return (
    <div className="sub-content"> 
      <div className="heading">
        <h1>🔍 Search Songs</h1>
        <h3>Find your favorite tracks</h3>
      </div>

      <div className="search-bar-container"> 
        <input
          type="text"
          className="search-bar"
          placeholder="Search songs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>

      <div className="search-results">
        {results.map((video) => (
          <div key={video.id.videoId} className="search-card"> 
            <img src={video.snippet.thumbnails.medium.url} alt="thumbnail" />
            <div className="search-info">
              <h4>{video.snippet.title}</h4>
              <p>{video.snippet.channelTitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;