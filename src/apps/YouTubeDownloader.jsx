import React, { useState } from "react";
import { AlertTriangle, Search, Download, Music } from "lucide-react";
import axios from "axios";

const YouTubeDownloader = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [qualities, setQualities] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState(null);
  const [mp3Quality, setMp3Quality] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");

  const API_URL = "http://192.168.30.36:3001";

  const isValidYouTubeUrl = (url) => {
    const regex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)[a-zA-Z0-9_-]{11}/;
    return regex.test(url);
  };

  const fetchVideoDetails = async () => {
    setError(null);
    setLoading(true);
    setQualities([]);
    setSelectedQuality(null);
    setMp3Quality(null);

    if (!isValidYouTubeUrl(videoUrl.trim())) {
      setError("Geçersiz YouTube URL'si. Lütfen doğru bir bağlantı girin.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/info`, {
        params: { url: videoUrl },
      });

      const videoData = response.data;
      setTitle(videoData.title);
      setThumbnail(videoData.thumbnail);

      const formats = videoData.formats.map((format) => ({
        label: `${format.quality} (${format.ext})`,
        url: format.url,
        type: format.ext,
        qualityValue: format.quality.includes("p")
          ? parseInt(format.quality)
          : format.ext === "m4a"
          ? 9999
          : format.ext === "audio"
          ? 9998
          : 0,
      }));

      // **Sadece MP4 ve WEBM formatlarını filtrele ve kalite sırasına göre sırala**
      const videoFormats = formats
        .filter((f) => f.type === "mp4" || f.type === "webm")
        .sort((a, b) => b.qualityValue - a.qualityValue);

      setQualities(videoFormats);
      setSelectedQuality(videoFormats[0]?.url || null);

      // **En kaliteli M4A formatını bul**
      const bestM4A = formats
        .filter((f) => f.type === "m4a")
        .sort((a, b) => b.qualityValue - a.qualityValue)[0]?.url;

      setMp3Quality(bestM4A || null);
    } catch (err) {
      let errorMessage =
        err.response?.data?.error || "Bilinmeyen bir hata oluştu.";

      if (errorMessage.includes("members-only content")) {
        errorMessage = "Bu video yalnızca kanal üyeleri için erişilebilir.";
      } else if (errorMessage.includes("geoblocked")) {
        errorMessage = "Bu video bulunduğunuz bölgede kullanılamıyor.";
      } else if (errorMessage.includes("Private video")) {
        errorMessage = "Bu video özeldir ve görüntülenemez.";
      }

      setError(`Hata: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url) => {
    if (!url) {
      setError("Lütfen bir kalite seçin.");
      return;
    }
    window.open(url, "_blank");
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg max-w-md mx-auto backdrop-blur-lg bg-opacity-80 border border-gray-700 mt-10 mb-10">
      <h2 className="text-center text-xl font-bold mb-4 text-blue-400">
        YouTube Video İndirici
      </h2>
      <div className="flex items-center rounded-lg mb-4 border-gray-700 gap-2">
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="YouTube video URL'sini girin"
          className="flex-grow bg-gray-800 p-3 rounded-lg text-white placeholder-gray-400 outline-none w-full border border-gray-600 focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchVideoDetails}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg transition disabled:opacity-50 shadow-md"
        >
          <Search size={23} />
        </button>
      </div>
      {loading && (
        <div className="text-center text-blue-500 animate-pulse">
          <p>Video yükleniyor, lütfen bekleyiniz...</p>
        </div>
      )}
      {error && (
        <div className="flex items-center text-red-500 mb-4 p-3 bg-gray-800 rounded-lg">
          <AlertTriangle className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      {!loading && thumbnail && (
        <div className="mb-4 flex flex-col items-center">
          <img
            src={thumbnail}
            alt="Video thumbnail"
            className="rounded-lg shadow-lg mb-2 border border-gray-700"
          />
          <h3 className="text-lg font-semibold text-center text-blue-300">
            {title}
          </h3>
        </div>
      )}
      {qualities.length > 0 && (
        <div className="space-y-3">
          <label htmlFor="qualitySelect" className="block mb-2 text-gray-300">
            Kalite Seç:
          </label>
          <select
            id="qualitySelect"
            onChange={(e) => setSelectedQuality(e.target.value)}
            value={selectedQuality}
            className="bg-gray-800 text-white p-3 rounded-lg w-full border border-gray-700"
          >
            {qualities.map((quality, index) => (
              <option key={index} value={quality.url}>
                {quality.label}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => handleDownload(selectedQuality)}
              disabled={!selectedQuality}
              className="flex-1 bg-green-600 hover:bg-green-700 p-3 rounded-lg disabled:opacity-50 transition shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <Download className="mr-2" size={20} /> İndir
            </button>
            <button
              onClick={() => handleDownload(mp3Quality)}
              disabled={!mp3Quality}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 p-3 rounded-lg disabled:opacity-50 transition shadow-lg hover:shadow-xl flex items-center justify-center cursor-pointer"
            >
              <Music className="mr-2" size={20} /> MP3 İndir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeDownloader;
