import React, { useState, useEffect } from "react";
import { db, doc, updateDoc } from "../../firebase/firebase";

const ChangeSlider = ({ video, onClose }) => {
  const [title, setTitle] = useState(video.title);
  const [thumbnailId, setThumbnailId] = useState(
    video.thumbnail.split("v=")[1] || ''  // Thumbnail ID boşsa, boş bir string göster
  ); 
  const [urlId, setUrlId] = useState(video.url.split("v=")[1] || ''); // Video ID from URL

  useEffect(() => {
    console.log("Thumbnail ID:", thumbnailId); // Kontrol için konsola yazdırın
  }, [thumbnailId]);

  const handleSave = async () => {
    try {
      // Rebuild URLs with the video IDs and add the base URL
      const newThumbnail = `https://img.youtube.com/vi/${thumbnailId}/0.jpg`; // Base URL for YouTube thumbnails
      const newUrl = `https://www.youtube.com/watch?v=${urlId}`; // Full video URL

      const videoRef = doc(db, "videos", video.videoId);
      await updateDoc(videoRef, {
        title,
        thumbnail: newThumbnail, // Store the full thumbnail URL
        url: newUrl, // Store the full video URL
      });
      onClose(); // Modal'ı kapat
    } catch (error) {
      console.error("Error updating video:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-gray-300 p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Videoyu Düzenle</h2>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="title">
            Başlık
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="thumbnail">
            Thumbnail ID
          </label>
          <input
            id="thumbnail"
            type="text"
            value={thumbnailId || ''}  // Eğer thumbnailId boşsa, boş bir string göster
            onChange={(e) => setThumbnailId(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter thumbnail video ID"
          />
          {/* Thumbnail Image Preview */}
          <div className="mt-2">
            <img
              src={`https://img.youtube.com/vi/${thumbnailId}/0.jpg`}
              alt="Thumbnail Preview"
              className="w-full mt-2"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="url">
            Video URL ID
          </label>
          <input
            id="url"
            type="text"
            value={urlId || ''}  // Eğer urlId boşsa, boş bir string göster
            onChange={(e) => setUrlId(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter URL video ID"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white p-2 rounded"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeSlider;
