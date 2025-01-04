import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";

const ChangeSlider = ({ video, onClose }) => {
  const [title, setTitle] = useState(video.title);
  const [videoId, setVideoId] = useState(video.url.split("v=")[1] || "");

  const handleSave = async () => {
    try {
      const newThumbnail = `https://img.youtube.com/vi/${videoId}/0.jpg`;
      const newUrl = `https://www.youtube.com/watch?v=${videoId}`;

      const videoRef = doc(db, "videos", video.videoId);
      await updateDoc(videoRef, {
        title,
        thumbnail: newThumbnail,
        url: newUrl,
      });
      onClose();
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
          <label className="block mb-2" htmlFor="videoId">
            Video ID
          </label>
          <input
            id="videoId"
            type="text"
            value={videoId || ""} // Eğer videoId boşsa, boş bir string göster
            onChange={(e) => setVideoId(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter video ID"
          />
          {/* Thumbnail Image Preview */}
          <div className="mt-2">
            {videoId && (
              <img
                src={`https://img.youtube.com/vi/${videoId}/0.jpg`}
                alt="Thumbnail Preview"
                className="w-full mt-2"
              />
            )}
          </div>
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
