import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";

const useGetYoutubeVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const videosCollection = collection(db, "videos");

    const unsubscribe = onSnapshot(
      videosCollection,
      (snapshot) => {
        const videoList = snapshot.docs.map((doc) => ({
          videoId: doc.id,
          title: doc.data().title,
          url: doc.data().url,
          thumbnail: doc.data().thumbnail,
        }));

        setVideos(videoList);
        setLoading(false);
      },
      (err) => {
        setError("Error fetching videos: " + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { videos, loading, error };
};

export default useGetYoutubeVideos;
