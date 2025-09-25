
import React, { useState, useEffect } from "react";
import "./Content.css";
import "./SearchPage.css";
import "./library.css";
import SongCard from "./SongCard";
import Playbar from "./Playbar";
import { detectMoodFromText } from "../utils/detectMoodFromText";
import { searchSongs } from "../api/youtube";
// import AudioPlayer from "./AudioPlayer";

const moodColors = [
  "#8D4B55", "#A85863", "#C46572", "#E07281", "#2E5A88", "#3A73AD",
  "#468CD2", "#52A5F7", "#5D4A88", "#755DB0", "#8D70D8", "#A583FF"
];
const Content = ({
  section,
  setCurrentSong,       // This is a setter from App.jsx
  setIsPlaying,         // This is a setter from App.jsx
  setCurrentPlaylist,   // This is a setter from App.jsx
  setCurrentSongIndex,  // This is a setter from App.jsx
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  // const [isPlaying, setIsPlaying] = useState(true);
  // const [trackDuration, setTrackDuration] = useState(0);
  // const [currentSong, setCurrentSong] = useState(null); //mo longer here its in App.jsx
  const [playlistSongs, setPlaylistSongs] = useState([]);
  // const [selectedMood, setSelectedMood] = useState("all");
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodResults, setMoodResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const localForYouSongs = [
    {
      title: "O Maahi",
      artist: "Arijit Singh",
      thumbnail: "/assets/Songs Cover/oMaahi.jpeg",
      url: "/assets/Songs/O Mahi.mp3",
      source: 'local'
    },
    {
      title: "Diet Mountain Dew",
      artist: "Lana Del Rey",
      thumbnail: "/assets/Songs Cover/Mountain.jpeg",
      url: "/assets/Songs/Diet-Mountain-Dew.mp3",
      source: 'local'
    },
    {
      title: "Starboy",
      artist: "The Weeknd, Daft Punk",
      thumbnail: "/assets/Songs Cover/starboy.jpeg",
      url: "/assets/Songs/Starboy.mp3",
      source: 'local'
    },
    {
      title: "Shape of You",
      artist: "Ed Sheeran",
      thumbnail: "/assets/Songs Cover/shape.jpeg",
      url: "/assets/Songs/Shape-Of-You.mp3",
      source: 'local'
    },
    {
      title: "Teri Deewani",
      artist: "Kailash Kher, Paresh Kamath",
      thumbnail: "/assets/Songs Cover/teri deewani.jpeg",
      url: "/assets/Songs/Teri-Deewani.mp3",
      source: 'local'
    },
    {
      title: "With You",
      artist: "AP Dhillon",
      thumbnail: "/assets/Songs Cover/with uh.jpeg",
      url: "/assets/Songs/With You.mp3",
      source: 'local'
    },
  ];

  const handlePlayForYouSong = (song) => {   //Function For For You section of home page
    setCurrentSong({ ...song, source: 'local' });
    setIsPlaying(true);

    // Set the playlist to the new array of hardcoded songs
    setCurrentPlaylist(localForYouSongs);

    // Find the index of the clicked song within this new playlist
    const clickedIndex = localForYouSongs.findIndex(s => s.url === song.url);
    setCurrentSongIndex(clickedIndex !== -1 ? clickedIndex : 0);
  };

  //This causing error CORS issue
  // useEffect(() => {
  //   const fetchSuggestions = async () => {
  //     if (query.trim().length < 2) { //check if user typed atleast 2 character
  //       setSuggestions([]);
  //       return;
  //     }

  //     try {
  //       const response = await fetch(
  //         `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(query)}`  //q=${encodeURIComponent(query)} adds the search input safely
  //         //encodeURIComponent() makes sure stuff like spaces & special characters don’t break the URL.
  //       );
  //       const data = await response.json();
  //       setSuggestions(data[1]); // List of suggestions
  //     } catch (err) {
  //       console.error("Autocomplete fetch failed", err);
  //     }
  //   };

  //   const debounceTimer = setTimeout(fetchSuggestions, 300);
  //   return () => clearTimeout(debounceTimer); //Timer for search suggestions 
  // }, [query]);

  useEffect(() => {
    if (section === "home") {
      fetchPopularArtistSongs(); // Use our new function
      //  Refresh every 5 minutes
      const interval = setInterval(fetchPopularArtistSongs, 300000);
      return () => clearInterval(interval);
    }
  }, [section]);

  const popularArtists = [
    "The Weeknd",
    "Lana Del Rey",
    "Arijit Singh",
    "Kailash Kher",
    "Rahat Fateh Ali Khan",
    "Bad Bunny",
    "Ed Sheeran",
    "Billie Eilish",
    "AP Dhillon",
    "Shreya Ghoshal"
  ];
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

  const handleSearch = async () => {
    if (query.trim()) {
      try {
        // Hit backend
        const response = await fetch("/api/mood/detect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: query })
        });

        const { mood } = await response.json();
        console.log("Detected mood :", mood);

        // Run search with smart NLP
        const enhancedQuery = `${query} ${mood} official lyrics`;
        const songs = await searchSongs(enhancedQuery);
        const filtered = filterLenient(songs);
        const sorted = sortByViews(filtered);

        // setSearchResults(sorted);
        setMoodResults(sorted);
        setSelectedMood(mood);
      } catch (err) {
        console.error("Mood detection or search failed:", err);
      }
    }
  };

  const handleInputChange = async (e) => {
    const input = e.target.value;
    setQuery(input);

    if (input.trim().length > 2) {
      try {
        // const res = await fetch("http://localhost:5000/api/autocomplete", {
        const res = await fetch("/api/autocomplete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: input })
        });
        const data = await res.json();
        setSuggestions(data.suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Frontend autocomplete fetch failed:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handlePlayLibrarySong = (song) => {
    console.log("Playing from library:", song);
    // 1. Set the current playlist to your library
    setCurrentPlaylist(playlistSongs);

    // 2. Find the index of the song you clicked on
    const clickedIndex = playlistSongs.findIndex(
      s => (s.id?.videoId || s.url) === (song.id?.videoId || song.url)
    );
    setCurrentSongIndex(clickedIndex !== -1 ? clickedIndex : 0);

    // 3. Set the clicked song as the current song and play it
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handlePlayLocalSong = (song) => {
    // Add the 'source' property so App.jsx knows how to handle it
    setCurrentSong({ ...song, source: 'local' });
    setIsPlaying(true);     // Ensure autoplay
    // --- IMPORTANT NEW LINES FOR PLAYLIST & INDEX ---
    // Set the current global playlist to the 'playlistSongs' array (your library)
    setCurrentPlaylist(playlistSongs);
    // Find the index of the clicked song within the playlistSongs array
    // Use a unique property like 'url' for local songs
    const clickedIndex = playlistSongs.findIndex(s => s.url === song.url);
    // Set the global current song index in App.jsx
    setCurrentSongIndex(clickedIndex !== -1 ? clickedIndex : 0);
    // --- END IMPORTANT NEW LINES ---
  };

  const handleSongClick = (video) => {
    // Standardize the song object structure
    setCurrentSong({
      source: 'youtube',
      title: video.snippet.title,
      artist: video.snippet.channelTitle,
      thumbnail: video.snippet.thumbnails?.medium?.url,
      id: { videoId: video.id }
    });
    setSelectedIndex(null);
    setIsPlaying(true);
    // Determine which array is the active "playlist" for search results.
    const activePlaylist = getFilteredResults();

    // Find the index of the clicked song within the active playlist
    const clickedIndex = activePlaylist.findIndex(s => s.id === video.id);

    // Set the global current playlist and index in App.jsx
    setCurrentPlaylist(activePlaylist);
    setCurrentSongIndex(clickedIndex !== -1 ? clickedIndex : 0);
  };

  const handleAddToPlaylist = (song) => {
    const alreadyAdded = playlistSongs.find(
      (item) => (item.id && item.id.videoId) === (song.id && song.id.videoId)
    );
    if (!alreadyAdded) {
      setPlaylistSongs((prev) => [...prev, song]);
    }
  };

  const handleMoodClick = async (mood) => {
    const songs = await searchSongs(mood + " songs");
    setSelectedMood(mood);
    setMoodResults(songs);
    setQuery("");
    setSearchResults([]);
  };
  const getFilteredResults = () => {
    // This logic is simplified to just return one set of results
    if (selectedMood) return moodResults;
    return searchResults;
  };

  const hasResults = getFilteredResults().length > 0;
  // const getFilteredResults = () => {
  //   if (selectedMood) {
  //     const moodWords = moodKeywords[selectedMood];
  //     return moodResults.filter((video) => {
  //       const title = video?.snippet?.title?.toLowerCase?.() || "";
  //       const channel = video?.snippet?.channelTitle?.toLowerCase?.() || "";
  //       return moodWords?.some(
  //         (keyword) => title.includes(keyword) || channel.includes(keyword)
  //       );
  //     });
  //   }
  //   return searchResults;
  // };

  const fetchPopularArtistSongs = async () => {
    try {
      const artist = popularArtists[Math.floor(Math.random() * popularArtists.length)];
      const query = `${artist} official music video`;
      const songs = await searchSongs(query);
      const filtered = filterStrict(songs);

      // Double-check filtering if we get few results
      const finalResults = filtered.length > 3 ? filtered : await searchAgain(artist);

      setResults(sortByViews(finalResults).slice(0, 12));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const searchAgain = async (artist) => {
    // Try alternative query if first fails (fetchPopularArtistSongs)
    const backupQuery = `${artist} popular songs -cover -live`;
    const songs = await searchSongs(backupQuery);
    return filterStrict(songs);
  };

  // Strict filter for home (clean content)
  const filterStrict = (videos) => {
    const forbiddenPatterns = [
      "quiz", "guess", "finish", "lyrics", "challenge",
      "compilation", "mashup", "mix", "edit", "cover",
      "live", "reaction", "status", "short", "shorts"
    ];

    return videos.filter((video) => {
      const title = video.snippet.title.toLowerCase();
      const channel = video.snippet.channelTitle.toLowerCase();

      // Must include these to be considered a real song
      const isOfficial = title.includes("official") ||
        channel.includes("vevo") ||
        channel.includes("music");

      // Must NOT include any forbidden patterns
      const isClean = !forbiddenPatterns.some(word => title.includes(word));

      return isOfficial && isClean;
    });
  };

  // Lenient filter for search (user control)
  const filterLenient = (songs) => {
    return songs.filter((video) => {
      if (!video.id) return false;

      const title = video.snippet.title.toLowerCase();
      const channel = video.snippet.channelTitle.toLowerCase();

      // Common patterns in official music videos
      const officialPatterns = [
        "official", "lyric", "song", "music", "audio",
        "video", "hits", "track", "musical", "sound"
      ];

      // Patterns to exclude
      const excludePatterns = [
        "cover", "reaction", "review", "interview",
        "live", "performance", "compilation", "mashup",
        "short", "shorts", "edit", "remix", "status"
      ];

      // Check if it's likely a music video
      const isMusicContent = officialPatterns.some(pattern =>
        title.includes(pattern) || channel.includes(pattern)
      );

      // Check if it's unwanted content
      const isBadContent = excludePatterns.some(pattern =>
        title.includes(pattern) || channel.includes(pattern)
      );

      // Prioritize videos that have music keywords and don't have excluded keywords
      return (isMusicContent || title.includes("lyric")) && !isBadContent;
    });
  };

  const sortByViews = (videos) => {
    return videos.sort((a, b) => {
      // If view count is missing, use "0"
      const viewsA = parseInt(a.statistics?.viewCount || "0");
      const viewsB = parseInt(b.statistics?.viewCount || "0");
      return viewsB - viewsA; // Bigger numbers come first
    });
  };

  const selectedVideoId = selectedIndex !== null ? results[selectedIndex]?.id?.videoId : null;

  return (
    <div className="sub-content">
      {section === "home" && (
        <>
          <div className="heading">
            <h1>Popular Songs</h1>
            <h3 style={{ cursor: "pointer" }} onClick={fetchPopularArtistSongs}>Refresh</h3>
          </div>

          <div className="parent-card">
            {/* {results.filter(isActualSong).map((video, index) => ( */}
            {results.map((video, index) => (
              <SongCard
               key={video.id.videoId}
                imgSrc={
                  video.snippet.thumbnails?.high?.url ||
                  video.snippet.thumbnails?.medium?.url ||
                  video.snippet.thumbnails?.default?.url
                }
                title={
                  video.snippet.title.length > 30
                    ? video.snippet.title.slice(0, 27) + "..."
                    : video.snippet.title
                }
                artist={
                  video.snippet.channelTitle.length > 25
                    ? video.snippet.channelTitle.slice(0, 22) + "..."
                    : video.snippet.channelTitle
                }
                css="pic1"
                onPlay={() => {
                  // 1. Create a new playlist where every song has our standard structure
                  const normalizedPlaylist = results.map(videoItem => ({
                    source: 'youtube',
                    title: videoItem.snippet.title,
                    artist: videoItem.snippet.channelTitle,
                    thumbnail: videoItem.snippet.thumbnails.medium.url,
                    // Ensure the ID structure is consistent across all songs
                    id: { videoId: videoItem.id }
                  }));

                  // 2. Find the specific song that was clicked from our new playlist
                  const clickedSongObject = normalizedPlaylist.find(song => song.id.videoId === video.id);

                  // 3. Set the state using our perfectly structured data
                  if (clickedSongObject) {
                    setCurrentSong(clickedSongObject);
                    setCurrentPlaylist(normalizedPlaylist);

                    const clickedIndex = normalizedPlaylist.findIndex(song => song.id.videoId === video.id);
                    setCurrentSongIndex(clickedIndex);

                    setIsPlaying(true);
                    setSelectedIndex(null); // Prevent conflict with Search
                  }
                }}
              />
            ))}
          </div>
          <div className="heading">
            <h1>For You</h1>
            <h3 style={{ cursor: "pointer" }}>Show all</h3>
          </div>
          <div className="parent-card">
            <SongCard
              css="pic1"
              imgSrc="/assets/Songs Cover/oMaahi.jpeg"
              title="O Maahi"
              artist="Arijit Singh"
              onPlay={() =>
                handlePlayForYouSong({
                  title: "O Maahi",
                  artist: "Arijit Singh",
                  thumbnail: "/assets/Songs Cover/oMaahi.jpeg",
                  url: "/assets/Songs/O Mahi.mp3", // Use 'url' instead of 'src'
                })
              }
            />
            <SongCard
              css="pic1"
              imgSrc="/assets/Songs Cover/Mountain.jpeg"
              title="Diet Mountain Dew"
              artist="Lana Del Rey"
              onPlay={() =>
                handlePlayForYouSong({
                  title: "Diet Mountain Dew",
                  artist: "Lana Del Rey",
                  thumbnail: "/assets/Songs Cover/Mountain.jpeg",
                  url: "/assets/Songs/Diet-Mountain-Dew.mp3", // Use 'url' instead of 'src'
                })
              }
            />
            <SongCard
              css="pic1"
              imgSrc="/assets/Songs Cover/starboy.jpeg"
              title="Starboy"
              artist="The Weeknd, Daft Punk"
              onPlay={() =>
                handlePlayForYouSong({
                  title: "Starboy",
                  artist: "The Weeknd, Daft Punk",
                  thumbnail: "/assets/Songs Cover/starboy.jpeg",
                  url: "/assets/Songs/Starboy.mp3", // Use 'url' instead of 'src'
                })
              }
            />
            <SongCard
              css="pic1"
              imgSrc="/assets/Songs Cover/shape.jpeg"
              title="Shape of You"
              artist="Ed Sheeran"
              onPlay={() =>
                handlePlayForYouSong({
                  title: "Shape of You",
                  artist: "Ed Sheeran",
                  thumbnail: "/assets/Songs Cover/shape.jpeg",
                  url: "/assets/Songs/Shape-Of-You.mp3", // Use 'url' instead of 'src'
                })
              }
            />
            <SongCard
              css="pic1"
              imgSrc="/assets/Songs Cover/teri deewani.jpeg"
              title="Teri Deewani"
              artist="Kailash Kher, Paresh Kamath"
              onPlay={() =>
                handlePlayForYouSong({
                  title: "Teri Deewani",
                  artist: "Kailash Kher, Paresh Kamath",
                  thumbnail: "/assets/Songs Cover/teri deewani.jpeg",
                  url: "/assets/Songs/Teri-Deewani.mp3", // Use 'url' instead of 'src'
                })
              }
            />
            <SongCard
              css="pic1"
              imgSrc="/assets/Songs Cover/with uh.jpeg"
              title="With You"
              artist="AP Dhillon"
              onPlay={() =>
                handlePlayForYouSong({
                  title: "With You",
                  artist: "AP Dhillon",
                  thumbnail: "/assets/Songs Cover/with uh.jpeg",
                  url: "/assets/Songs/With You.mp3", // Use 'url' instead of 'src'
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
          {/* This heading changes based on the view */}
          <div className="heading">
            <h1>{hasResults ? "Search Results" : "Browse All"}</h1>
            {/* ADDED: A "Back" button to return to the grid */}
            {hasResults && (
              <h3 onClick={() => setMoodResults([])}>Back to Browse</h3>
            )}
          </div>

          {/* <div className="mood-section">
            <h2 className="mood-heading">Choose Your Mood</h2>
            <div className="mood-toggle-container">
              {Object.keys(moodKeywords).map((mood) => (
                <button
                  key={mood}
                  className={`mood-toggle ${selectedMood === mood ? "active" : ""}`}
                  onClick={async () => {
                    const songs = await searchSongs(mood + " songs");
                    const filtered = filterLenient(songs);
                    setSelectedMood(mood);
                    setMoodResults(sortByViews(filtered));
                    setQuery("");  // clear manual input
                    setSearchResults([]); // clear search results
                  }}
                >
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </button>
              ))}
            </div>
          </div> */}
          <div className="heading">
            <h1>🔍 Search Music</h1>
            <h3>Find your favorite tracks</h3>
          </div>

          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search songs..."
              value={query}
              // onChange={(e) => setQuery(e.target.value)}
              onChange={handleInputChange}
              className="search-bar"
            />
            {suggestions.length > 0 && (
              <ul className="autocomplete-list">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="autocomplete-item"
                    onClick={() => {
                      setQuery(suggestion);
                      setSuggestions([]);
                      handleSearch(); // Trigger search immediately
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
            <button className="search-button" onClick={handleSearch}>Search</button>
          </div>


          {selectedMood && getFilteredResults().length > 0 && (
            <h3 className="mood-result-heading">🎶 Showing results for: "{selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)}"</h3>
          )}


          {/* If there are results, it shows your existing results list.
              If not, it shows the new mood grid. */}
          {hasResults ? (
            <div className="search-results">
              {getFilteredResults().map((video, index) => (
                <div
                  // key={video.id}
                  key={video.id.videoId}
                  className="search-card"
                  onClick={() => handleSongClick(video)} //changed index to video
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
                        thumbnail: video.snippet.thumbnails?.medium?.url,
                        id: { videoId: video.id },
                        source: 'youtube'
                      });
                    }}
                  >
                    ➕ Add
                  </button>
                </div>
              ))}
            </div>
        
      ) : (
        <div className="mood-grid-container">
              {Object.keys(moodKeywords).map((mood, index) => (
                <div
                  key={mood}
                  className="mood-card"
                  style={{ '--card-bg': moodColors[index % moodColors.length] }}
                  onClick={() => handleMoodClick(mood)}
                >
                  <span>{mood.charAt(0).toUpperCase() + mood.slice(1)}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {
        section === "library" && (
          <>
            <div className="heading">
              <h1>🎵 Your Library</h1>
            </div>
            {playlistSongs.length === 0 ? (
              <p>Your playlists is Empty</p>
            ) : (
              <div className="search-results">
                {playlistSongs.map((song) => (
                  <div key={song.id?.videoId || song.url} className="search-card">
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
                        // onClick={() =>
                        //   handlePlayLocalSong({
                        //     title: song.title,
                        //     artist: song.artist,
                        //     thumbnail: song.thumbnail,
                        //     url: song.url, // Pass the url
                        //     id: song.id, // Pass youtube id if it exists
                        //   })
                        // }
                        onClick={() => handlePlayLibrarySong(song)}
                      >
                        ▶ Play
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => {
                          const updatedPlaylist = playlistSongs.filter(
                            (item) => (item.id?.videoId || item.url) !== (song.id?.videoId || song.url)
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


      {/* {
        (selectedVideoId || currentSong) && (
          <Playbar
            results={selectedIndex !== null ? results : currentSong ? [currentSong] : []}
            selectedIndex={selectedIndex !== null ? selectedIndex : 0}
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
      } */}
    </div >
  );
};

export default Content;