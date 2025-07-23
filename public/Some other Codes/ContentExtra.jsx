
import React, { useState, useEffect } from "react";
import "./Content.css";
import "./SearchPage.css";
import "./library.css";
import SongCard from "./SongCard";
import Playbar from "./Playbar";
import { searchSongs } from "../api/youtube";
// import AudioPlayer from "./AudioPlayer";

const Content = ({ section }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [trackDuration, setTrackDuration] = useState(0);
  const [currentSong, setCurrentSong] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  // const [selectedMood, setSelectedMood] = useState("all");
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodResults, setMoodResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const trendingTopics = [
    "Top Hindi songs",
    "Trending Bollywood",
    "Viral Reels Songs",
    "Latest English hits",
    "Top Punjabi Songs",
    "Billboard Top 100",
    "Lo-fi Chill Hits",
    "Romantic songs 2024",
    "Workout Bangers",
    "Rainy day playlist",
    "Indie Pop",
    "Chill Indie Vibes",
    "Sad English songs",
    "New Rap Songs",
    "EDM Festival Bangers",
    "Soothing Piano",
    "Old School Hip Hop",
    "2024 Pop Songs",
    "Punjabi Romantic Songs",
    "Acoustic Covers"
  ];

  useEffect(() => {
    if (section === "home") {
      const randomTopic = trendingTopics[Math.floor(Math.random() * trendingTopics.length)];
      fetchTrendingSongs(randomTopic);
    }
  }, [section]);

  const moodKeywords = {
    chill: ["lofi", "chill", "relax", "calm", "ambient"],
    sad: ["sad", "heartbreak", "emotional", "tears", "cry"],
    romantic: ["romantic", "love", "valentine", "crush"],
    party: ["party", "club", "dance", "banger", "remix"],
    workout: ["gym", "workout", "pump", "beast", "power"],
    motivational: ["motivation", "inspiration", "hustle", "grind"],
    happy: ["happy", "joy", "sunshine", "smile", "good vibes"],
    angry: ["angry", "rage", "scream", "metal", "hardcore"],
    focus: ["focus", "study", "concentration", "deep work", "instrumental"],
    driving: ["driving", "road trip", "highway", "cruise", "ride"],
    breakup: ["breakup", "ex", "alone", "tears", "letting go"],
    rainy: ["rainy", "monsoon", "drizzle", "cloudy", "sad chill"]
  };

  useEffect(() => {
    const storedPlaylist = localStorage.getItem("playlistSongs");
    if (storedPlaylist) {
      setPlaylistSongs(JSON.parse(storedPlaylist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("playlistSongs", JSON.stringify(playlistSongs));
  }, [playlistSongs]);

  const selectedVideoId = selectedIndex !== null ? results[selectedIndex]?.id?.videoId : null;

  const handlePlayLocalSong = (song) => {
    setCurrentSong(song);
    setSelectedIndex(null); // to avoid conflict with YouTube results
  };

  const handleSearch = async () => {
    if (query.trim()) {
      const songs = await searchSongs(query);
      setSearchResults(songs);
      setSelectedMood(null); // reset mood selection
    }
  };

  const handleSongClick = (index) => {
    setSelectedIndex(index);
  };
  // const handleSongClick = (song) => {
  //   setCurrentSong(song);     // ✅ This is needed for Playbar
  //   setIsPlaying(true);       // ✅ Start playing
  //   setSelectedIndex(null);   // ✅ Prevent conflict with YouTube mode
  // };
  const handleAddToPlaylist = (song) => {
    const alreadyAdded = playlistSongs.find(
      (item) => item.videoId === song.videoId
    );
    if (!alreadyAdded) {
      setPlaylistSongs((prev) => [...prev, song]);
    }
  };


  const getFilteredResults = () => {
    if (selectedMood) {
      const moodWords = moodKeywords[selectedMood];
      return moodResults.filter((video) => {
        const title = video?.snippet?.title?.toLowerCase?.() || "";
        const channel = video?.snippet?.channelTitle?.toLowerCase?.() || "";
        return moodWords?.some(
          (keyword) => title.includes(keyword) || channel.includes(keyword)
        );
      });
    }
    return searchResults;
  };

const fetchTrendingSongs = async (topic) => {
  try {
    const songs = await searchSongs(topic);
    setResults(songs);
  } catch (error) {
    console.error("Failed to fetch trending songs:", error);
  }
};

  return (
    <div className="sub-content">
      {section === "home" && (
        <>
          <div className="heading">
            <h1>Popular Songs</h1>
            <h3>Show all</h3>
          </div>
          <div className="parent-card">
            <SongCard
              css="pic1"
              imgSrc="/assets/Songs Cover/oMaahi.jpeg"
              title="O Maahi"
              artist="Arijit Singh"
              onPlay={() =>
                handlePlayLocalSong({
                  title: "O Maahi",
                  artist: "Arijit Singh",
                  thumbnail: "/assets/Songs Cover/oMaahi.jpeg",
                  src: "/assets/Songs/O Mahi.mp3",
                })
              }
            />
            <SongCard
              css="pic1"
              imgSrc="/assets/Songs Cover/Mountain.jpeg"
              title="Diet Mountain Dew"
              artist="Lana Del Rey"
              onPlay={() =>
                handlePlayLocalSong({
                  title: "Diet Mountain Dew",
                  artist: "Lana Del Rey",
                  thumbnail: "/assets/Songs Cover/Mountain.jpeg",
                  src: "/assets/Songs/Diet-Mountain-Dew.mp3",
                })
              }
            />
            <SongCard
              css="pic1"
              imgSrc="/assets/Songs Cover/starboy.jpeg"
              title="Starboy"
              artist="The Weeknd, Daft Punk"
              onPlay={() =>
                handlePlayLocalSong({
                  title: "Starboy",
                  artist: "The Weeknd, Daft Punk",
                  thumbnail: "/assets/Songs Cover/starboy.jpeg",
                  src: "/assets/Songs/Starboy.mp3",
                })
              }
            />
            <SongCard
              css="pic1"
              imgSrc="/assets/Songs Cover/shape.jpeg"
              title="Shape of You"
              artist="Ed Sheeran"
              onPlay={() =>
                handlePlayLocalSong({
                  title: "Shape of You",
                  artist: "Ed Sheeran",
                  thumbnail: "/assets/Songs Cover/shape.jpeg",
                  src: "/assets/Songs/Shape-Of-You.mp3",
                })
              }
            />
            <SongCard
              css="pic1"
              imgSrc="/assets/Songs Cover/teri deewani.jpeg"
              title="Teri Deewani"
              artist="Kailash Kher, Paresh Kamath"
              onPlay={() =>
                handlePlayLocalSong({
                  title: "Teri Deewani",
                  artist: "Kailash Kher, Paresh Kamath",
                  thumbnail: "/assets/Songs Cover/teri deewani.jpeg",
                  src: "/assets/Songs/Teri-Deewani.mp3",
                })
              }
            />
            <SongCard
              css="pic1"
              imgSrc="/assets/Songs Cover/with uh.jpeg"
              title="With You"
              artist="AP Dhillon"
              onPlay={() =>
                handlePlayLocalSong({
                  title: "With You",
                  artist: "AP Dhillon",
                  thumbnail: "/assets/Songs Cover/with uh.jpeg",
                  src: "/assets/Songs/With You.mp3",
                })
              }
            />
          </div>


          <div className="heading">
            <h1>Popular artists</h1>
            <h3>Show all</h3>
          </div>

          <div className="parent-card">
            <SongCard css="pic" imgSrc={"/assets/Artists/arijit.jpeg"} title="Arijit Singh" artist="Artist" />
            <SongCard css="pic" imgSrc={"/assets/Artists/Lana.jpg"} title="Lana Del Rey" artist="Artist" />
            <SongCard css="pic" imgSrc={"/assets/Artists/weeknd.jpeg"} title="The Weeknd" artist="Artist" />
            <SongCard css="pic" imgSrc={"/assets/Artists/edsheren.jpeg"} title="Ed Sheeren" artist="Artist" />
            <SongCard css="pic" imgSrc={"/assets/Artists/kailash.jpeg"} title="Kailash Kher" artist="Artist" />
            <SongCard css="pic" imgSrc={"/assets/Artists/ApDhillon.jpeg"} title="Ap Dhillon" artist="Artist" />
          </div>
        </>
      )}

      {section === "search" && (
        <>
          <div className="mood-section">
            <h2 className="mood-heading">🎭 Choose Your Mood</h2>
            <div className="mood-toggle-container">
              {Object.keys(moodKeywords).map((mood) => (
                <button
                  key={mood}
                  className={`mood-toggle ${selectedMood === mood ? "active" : ""}`}
                  onClick={async () => {
                    setSelectedMood(mood);
                    const songs = await searchSongs(mood + " songs");
                    setMoodResults(songs);
                    setQuery("");  // clear manual input
                    setSearchResults([]); // clear search results
                  }}
                >
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="heading">
            <h1>🔍 Search Music</h1>
            <h3>Find your favorite tracks</h3>
          </div>

          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search songs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-bar"
            />
            <button className="search-button" onClick={handleSearch}>Search</button>
          </div>


          {selectedMood && getFilteredResults().length > 0 && (
            <h3 className="mood-result-heading">🎶 Showing results for: "{selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)}"</h3>
          )}

          <div className="search-results">
            {getFilteredResults().map((video, index) => (
              <div
                key={video.id.videoId}
                className="search-card"
                onClick={() => handleSongClick(index)}
              >
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt="thumbnail"
                  className="search-thumbnail"
                />

                <div className="search-details">
                  <h4 className="search-title">{video.snippet.title}</h4>
                  <p className="search-channel">{video.snippet.channelTitle}</p>
                </div>

                <button
                  className="add-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToPlaylist({
                      title: video.snippet.title,
                      artist: video.snippet.channelTitle,
                      thumbnail: video.snippet.thumbnails.medium.url,
                      videoId: video.id.videoId,
                    });
                  }}
                >
                  ➕ Add
                </button>
              </div>
            ))}
          </div>
        </>
      )
      }

      {
        section === "library" && (
          <>
            <div className="heading">
              <h1>🎵 Your Library</h1>
              {/* <h3>Coming Soon</h3> */}
            </div>
            {playlistSongs.length === 0 ? (
              <p>Your playlists is Empty</p>
            ) : (
              <div className="search-results">
                {playlistSongs.map((song, index) => (
                  <div key={song.videoId} className="search-card">
                    <img
                      src={song.thumbnail}
                      alt="thumbnail"
                      className="search-thumbnail"
                    />
                    <div className="search-details">
                      <h4 className="search-title">{song.title}</h4>
                      <p className="search-channel">{song.artist}</p>
                    </div>
                    <div className="library-actions">
                      <button
                        className="add-btn"
                        onClick={() =>
                          handlePlayLocalSong({
                            title: song.title,
                            artist: song.artist,
                            thumbnail: song.thumbnail,
                            src: song.src || `https://www.youtube.com/watch?v=${song.videoId}`,
                          })
                        }
                      >
                        ▶ Play
                      </button>

                      <button
                        className="remove-btn"
                        onClick={() => {
                          const updatedPlaylist = playlistSongs.filter(
                            (item) => item.videoId !== song.videoId
                          );
                          setPlaylistSongs(updatedPlaylist);
                        }}
                      >
                        ❌ Remove
                      </button>
                    </div>
                  </div>
                ))}

              </div>

            )}

          </>
        )
      }


      {
        (selectedVideoId || currentSong) && (
          <Playbar
            results={results}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            currentSong={currentSong}
            setCurrentSong={setCurrentSong}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            trackDuration={trackDuration}
            setTrackDuration={setTrackDuration}
            onPlayToggle={() => setIsPlaying((prev) => !prev)}
          />

        )
      }
    </div >
  );
};

export default Content;
