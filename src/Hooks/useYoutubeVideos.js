import { useState, useEffect } from "react";
import axios from "axios";

const useYouTubeVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const channelId = import.meta.env.VITE_CHANNEL_ID;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          "https://www.googleapis.com/youtube/v3/search",
          {
            params: {
              part: "snippet",
              channelId,
              maxResults: 4,
              order: "date",
              key: apiKey,
            },
          }
        );

        // Video verisini kontrol et
        console.log(response.data.items); // Veriyi burada kontrol edebilirsiniz.

        setVideos(response.data.items);
      } catch (err) {
        setError("Error fetching YouTube videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [apiKey, channelId]);

  return { videos, loading, error };
};

export default useYouTubeVideos;
