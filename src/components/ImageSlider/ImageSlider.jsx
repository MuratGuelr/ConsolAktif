// ImageSlider.js

import React, { useState, useEffect } from "react";
import useGetYoutubeVideos from "../hooks/useGetYoutubeVideos";
import { GrFormEdit } from "react-icons/gr";
import ChangeSlider from "../../pages/ChangeSlider/ChangeSlider";

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { videos, loading, error } = useGetYoutubeVideos();

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? videos.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === videos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleEdit = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval); // Component unmount olduğunda interval temizlenir
  }, [currentIndex]);

  if (loading) return <p>Loading videos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="relative w-full p-5">
      {isModalOpen && (
        <ChangeSlider video={selectedVideo} onClose={handleCloseModal} />
      )}

      <div className="relative h-56 w-2/4 mx-auto overflow-hidden rounded-lg md:h-96">
        {videos.map((video, index) => (
          <div
            key={video.videoId}
            className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-in-out ${
              index === currentIndex
                ? "opacity-100 transform translate-x-0"
                : "opacity-0 transform translate-x-full"
            }`}
          >
            <a href={video.url} target="_blank" rel="noopener noreferrer">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="absolute block w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-1/2 transform bg-gray-800 -translate-x-1/2 bg-opacity-50 text-white w-full text-center p-0.5">
                <h3 className="text-lg">{video.title}</h3>
              </div>
            </a>
            <GrFormEdit
              size={35}
              className="absolute right-0 text-gray-500 cursor-pointer bg-gray-800 rounded-bl-lg"
              onClick={() => handleEdit(video)} // Edit ikonuna tıklanınca modal açılır
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={goToPrevious}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
          <svg
            className="w-4 h-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
        </span>
      </button>

      <button
        type="button"
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={goToNext}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
          <svg
            className="w-4 h-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
        </span>
      </button>
    </div>
  );
};

export default ImageSlider;
