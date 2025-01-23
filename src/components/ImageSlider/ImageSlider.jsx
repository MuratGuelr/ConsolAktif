import React, { useState, useEffect } from "react";
import ImageSpinner from "../Spinner/ImageSpinner";
import { useSpring, animated, config } from "@react-spring/web";

const ImageSlider = ({ videos, loading, error, onLoad }) => {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    if (!loading && videos?.length > 0) {
      onLoad?.(); // Slider yüklendiğinde callback'i çağır
    }
  }, [loading, videos, onLoad]);

  // Slider container animasyonu
  const containerSpring = useSpring({
    from: { opacity: 0, transform: "scale(0.95)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: config.gentle,
  });

  // Navigation butonları için hover animasyonu
  const [prevButtonProps, prevButtonApi] = useSpring(() => ({
    scale: 1,
    config: { tension: 300, friction: 10 },
  }));

  const [nextButtonProps, nextButtonApi] = useSpring(() => ({
    scale: 1,
    config: { tension: 300, friction: 10 },
  }));

  // Video kartı için daha hızlı hover animasyonu
  const [cardProps, cardApi] = useSpring(() => ({
    scale: 1,
    config: {
      tension: 400, // Daha yüksek tension değeri
      friction: 15, // Daha düşük friction değeri
    },
  }));

  if (loading)
    return (
      <div className="bg-gray-900 flex mx-auto">
        <ImageSpinner />
      </div>
    );
  if (error) return <p>{error}</p>;

  return (
    <animated.div
      style={containerSpring}
      className="relative w-full p-5 max-w-screen-xl mx-auto"
    >
      <div className="relative h-56 w-full max-w-lg mx-auto rounded-lg md:h-96 overflow-hidden">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className={`absolute top-0 left-0 w-full h-full transition-all duration-300 ease-in-out ${
              index === currentIndex
                ? "opacity-100 transform translate-x-0"
                : "opacity-0 transform translate-x-full"
            }`}
          >
            <animated.a
              style={index === currentIndex ? cardProps : {}}
              onMouseEnter={() =>
                index === currentIndex && cardApi.start({ scale: 1.03 })
              }
              onMouseLeave={() =>
                index === currentIndex && cardApi.start({ scale: 1 })
              }
              href={`https://www.youtube.com/watch?v=${video?.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative h-full"
            >
              <img
                src={video?.snippet?.thumbnails?.standard?.url}
                alt={video?.snippet?.title}
                className="block w-full h-full object-cover rounded-lg"
              />
              <div className="absolute bottom-0 left-1/2 transform bg-gray-800 -translate-x-1/2 bg-opacity-50 text-white w-full text-center p-1 mt-4 rounded-b-lg">
                <h3 className="text-base font-semibold">
                  {video?.snippet?.title}
                </h3>
              </div>
              <span className="absolute text-sm font-medium me-2 px-2.5 py-1 rounded top-0 left-2 bg-gray-700 text-gray-200">
                {formatDate(video?.snippet?.publishedAt)}
              </span>
            </animated.a>
          </div>
        ))}
      </div>

      <animated.button
        style={prevButtonProps}
        onMouseEnter={() => prevButtonApi.start({ scale: 1.1 })}
        onMouseLeave={() => prevButtonApi.start({ scale: 1 })}
        onClick={goToPrevious}
        className="absolute top-0 start-0 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
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
      </animated.button>

      <animated.button
        style={nextButtonProps}
        onMouseEnter={() => nextButtonApi.start({ scale: 1.1 })}
        onMouseLeave={() => nextButtonApi.start({ scale: 1 })}
        onClick={goToNext}
        className="absolute top-0 end-0 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
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
      </animated.button>
    </animated.div>
  );
};

export default ImageSlider;
