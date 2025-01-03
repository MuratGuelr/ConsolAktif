// useGetYoutubeVideos.js

import { useState, useEffect } from "react";
import { db, collection, getDocs, setDoc, doc } from "../../firebase/firebase";

const useGetYoutubeVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        
        // "videos" koleksiyonu var mı kontrol et
        const querySnapshot = await getDocs(collection(db, "videos"));
        
        // Eğer koleksiyonda hiç veri yoksa, test verisi ekle
        if (querySnapshot.empty) {
          console.log("No videos found, adding test data...");
          const testVideos = [
            {
              title: "Test Video 1",
              thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
              url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              videoID: ""
            },
            {
              title: "Test Video 2",
              thumbnail: "https://img.youtube.com/vi/tgbNymZ7vqY/hqdefault.jpg",
              url: "https://www.youtube.com/watch?v=tgbNymZ7vqY",
              videoID: ""
            }
            ,
            {
              title: "Test Video 3",
              thumbnail: "https://img.youtube.com/vi/tgbNymZ7vqY/hqdefault.jpg",
              url: "https://www.youtube.com/watch?v=tgbNymZ7vqY",
              videoID: ""
            }
            ,
            {
              title: "Test Video ",
              thumbnail: "https://img.youtube.com/vi/tgbNymZ7vqY/hqdefault.jpg",
              url: "https://www.youtube.com/watch?v=tgbNymZ7vqY",
              videoID: ""
            }
          ];

          // Test verilerini Firestore'a ekle
          testVideos.forEach(async (video, index) => {
            const videoRef = doc(db, "videos", `video${index + 1}`);
            await setDoc(videoRef, video);
          });
        }

        // Veriyi Firestore'dan al
        const snapshot = await getDocs(collection(db, "videos"));
        const videoList = snapshot.docs.map((doc) => ({
          videoId: doc.id,
          ...doc.data(),
        }));
        setVideos(videoList);
      } catch (err) {
        setError("Failed to fetch videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return { videos, loading, error };
};

export default useGetYoutubeVideos;
