import React, { useState } from "react";

const ImageSlider = () => {
  const videos = [
    {
      videoId: "vtazUb2RdmE",
      title: "Yayın ve videolarda GAMEPAD nasıl gösterilir?",
      thumbnail:
        "https://i9.ytimg.com/vi_webp/vtazUb2RdmE/maxresdefault.webp?v=66ef6053&sqp=CMDK2rsG&rs=AOn4CLCyVuaR0VQ4QddsohYhfxBCyA7T9Q",
    },
    {
      videoId: "c_6dkbQjI68",
      title: "Logitech G305 Lightspeed İncelemesi! ( 2024 )",
      thumbnail:
        "https://i9.ytimg.com/vi_webp/c_6dkbQjI68/maxresdefault.webp?v=66bbc037&sqp=CMDK2rsG&rs=AOn4CLDLE3NK-o9PyZph_z0ZW8I45yrg6g",
    },
    {
      videoId: "sE4zxw6_ejI",
      title: "Edit yapıyorsan bu videoyu kesinlikle İZLEMELİSİN!",
      thumbnail:
        "https://i9.ytimg.com/vi_webp/sE4zxw6_ejI/mqdefault_custom_1.webp?v=66ad6dcb&sqp=CMDK2rsG&rs=AOn4CLBcRkj-YDwlhTRdwcDVBoid_qe6Lw",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <div className="relative w-full p-5" data-carousel="slide">
      <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        {/* Slider'daki video */}
        {videos.map((video, index) => (
          <div
            key={video.videoId}
            className={`duration-700 ease-in-out ${
              index === currentIndex ? "block" : "hidden"
            }`}
            data-carousel-item
          >
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="absolute block w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 transition-all duration-500"
              />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white p-2 w-full text-center">
                <h3 className="text-lg">{video.title}</h3>
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Carousel Slide butonları */}
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {videos.map((_, index) => (
          <button
            key={index}
            type="button"
            className="w-3 h-3 rounded-full"
            aria-current={index === currentIndex ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
            onClick={() => setCurrentIndex(index)}
          ></button>
        ))}
      </div>

      {/* Previous Button */}
      <button
        type="button"
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={goToPrevious}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
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
          <span className="sr-only">Previous</span>
        </span>
      </button>

      {/* Next Button */}
      <button
        type="button"
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={goToNext}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
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
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

export default ImageSlider;
