
export const searchSongs = async (query) => {
  if (!query) return [];

  try {
    // This securely calls YOUR server, not Google directly.
    const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Search Error:", errorData.error);
      return [];
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("Failed to fetch search results from your server:", error);
    return [];
  }
};