import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { format } from 'date-fns';

const useGetYoutubeVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        // API ve Channel ID kontrolü
        const channelId = import.meta.env.VITE_CHANNEL_ID;
        const apiKey = import.meta.env.VITE_API_KEY;

        if (!channelId || !apiKey) {
          throw new Error('Channel ID veya API Key bulunamadı');
        }

        const today = format(new Date(), 'yyyy-MM-dd');
        const cacheRef = doc(db, 'youtubeCache', today);
        
        // Firebase'den günlük cache'i kontrol et
        const cacheDoc = await getDoc(cacheRef);
        
        if (cacheDoc.exists()) {
          console.log('Cache bulundu:', today);
          setVideos(cacheDoc.data().videos);
          setLoading(false);
          return;
        }

        console.log('Cache bulunamadı, API\'den veriler çekiliyor...');

        // Cache yoksa YouTube API'den çek
        const channelResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
        );

        if (!channelResponse.ok) {
          throw new Error('YouTube API yanıt vermedi');
        }

        const channelData = await channelResponse.json();

        if (!channelData.items?.[0]) {
          throw new Error('Kanal bulunamadı');
        }

        const uploadPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

        const playlistResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${uploadPlaylistId}&key=${apiKey}`
        );

        if (!playlistResponse.ok) {
          throw new Error('Playlist verisi alınamadı');
        }

        const playlistData = await playlistResponse.json();

        if (!playlistData.items) {
          throw new Error('Video bulunamadı');
        }

        const videoIds = playlistData.items.map(item => item.snippet.resourceId.videoId);
        
        const videoResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(',')}&key=${apiKey}`
        );

        if (!videoResponse.ok) {
          throw new Error('Video detayları alınamadı');
        }

        const videoData = await videoResponse.json();
        const fetchedVideos = videoData.items || [];

        console.log('Veriler API\'den çekildi, Firebase\'e kaydediliyor...');

        // Verileri Firebase'e cache'le
        try {
          await setDoc(cacheRef, {
            videos: fetchedVideos,
            timestamp: new Date().toISOString()
          });
          console.log('Veriler Firebase\'e kaydedildi');
        } catch (firebaseError) {
          console.error('Firebase kayıt hatası:', firebaseError);
          throw new Error('Veriler cache\'lenemedi');
        }

        setVideos(fetchedVideos);
      } catch (err) {
        console.error('Hook hatası:', err);
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []); 

  return { videos, loading, error };
};

export default useGetYoutubeVideos;