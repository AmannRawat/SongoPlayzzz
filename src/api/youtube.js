const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export async function searchSongs(query) {
  try {
    //  Searching for video IDs (basic info)
    const searchResponse = await fetch(
      `${BASE_URL}/search?part=snippet&type=video&maxResults=15&q=${encodeURIComponent(query + ' song')}&videoCategoryId=10&key=${API_KEY}`
    );
    const searchData = await searchResponse.json();

    if (!searchData.items) {
      console.error("YouTube API returned no items", searchData);
      return [];
    }

    //  Extract video IDs
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    if (!videoIds) return [];

    // Fetch video details (statistics + snippet)
    const detailsResponse = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`
    );
    const detailsData = await detailsResponse.json();

    if (!detailsData.items) {
      console.error("No detailed video data found");
      return [];
    }

    return detailsData.items;
  } catch (error) {
    console.error("YouTube API error:", error);
    return [];
  }
}

