import { useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { FaRegEye, FaComment, FaPlay } from "react-icons/fa";
import { useSpring, animated, config } from "@react-spring/web";

const VideoCard = ({ video, loading, error }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Kart için hover animasyonu
  const [hoverProps, hoverApi] = useSpring(() => ({
    scale: 1,
    config: { tension: 300, friction: 10 },
  }));

  // Play button ve thumbnail için hover stili
  const [playButtonProps, playButtonApi] = useSpring(() => ({
    scale: 1,
    opacity: 0,
    blur: 0,
    config: { tension: 300, friction: 10 },
  }));

  // Thumbnail için blur ve opacity animasyonu
  const [thumbnailProps, thumbnailApi] = useSpring(() => ({
    filter: "brightness(0.8)",
    opacity: 1,
    config: { tension: 300, friction: 20 },
  }));

  // Daha hızlı description animasyonu
  const descriptionSpring = useSpring({
    height: isExpanded ? "auto" : "3rem",
    opacity: 1,
    config: { tension: 400, friction: 10 }, // Daha hızlı geçiş
  });

  const formatCount = (count) => {
    if (!count) return "0";
    const num = parseInt(count);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const videoUrl = `https://www.youtube.com/watch?v=${video?.id}`;

  return (
    <animated.div
      style={hoverProps}
      onMouseEnter={() => {
        hoverApi.start({ scale: 1.05 });
        playButtonApi.start({ opacity: 1 });
        thumbnailApi.start({
          filter: "blur(0.7px) brightness(0.8)",
          opacity: 0.7,
        });
      }}
      onMouseLeave={() => {
        hoverApi.start({ scale: 1 });
        playButtonApi.start({ opacity: 0 });
        thumbnailApi.start({
          filter: "blur(0px) brightness(1)",
          opacity: 1,
        });
      }}
      className="bg-gray-700 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
      key={video.id}
    >
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group block"
      >
        <animated.img
          style={thumbnailProps}
          src={video?.snippet?.thumbnails?.standard?.url}
          alt={video?.snippet?.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

        {/* Play Button Overlay */}
        <animated.div
          style={playButtonProps}
          className="absolute inset-0 flex items-center justify-center"
        >
          <animated.div
            style={playButtonProps}
            onMouseEnter={() => playButtonApi.start({ scale: 1.05 })}
            onMouseLeave={() => playButtonApi.start({ scale: 1 })}
            className="w-12 h-12 bg-red-600 bg-opacity-80 rounded-full flex items-center justify-center cursor-pointer"
          >
            <FaPlay size={20} className="text-gray-200" />
          </animated.div>
        </animated.div>
      </a>

      <div className="flex justify-between mt-1 p-2">
        <div className="flex items-center space-x-1">
          <FaRegEye size={17} className="text-gray-200" />
          <span className="text-sm font-semibold text-gray-300">
            {formatCount(video?.statistics?.viewCount)}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <FaComment size={15} className="text-gray-200" />
          <span className="text-sm text-gray-300 font-semibold">
            {formatCount(video?.statistics?.commentCount)}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <AiFillLike size={17} className="text-gray-200" />
          <span className="text-sm text-gray-200 font-semibold">
            {formatCount(video?.statistics?.likeCount)}
          </span>
        </div>
      </div>

      <div className="p-3">
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:text-blue-600"
        >
          <h3 className="font-medium text-lg text-gray-200 line-clamp-2 mb-1">
            {video?.snippet?.title}
          </h3>
        </a>

        <animated.div style={descriptionSpring} className="overflow-hidden">
          <p className={`text-sm text-gray-300`}>
            {isExpanded ? (
              <div className="text-xs">{video?.snippet?.description}</div>
            ) : (
              <div>{video?.snippet?.description.substring(0, 100)}...</div>
            )}
          </p>
        </animated.div>

        {video?.snippet?.description?.length > 100 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-700 mt-1"
          >
            {isExpanded ? "Daha az göster" : "Daha fazla göster"}
          </button>
        )}

        <p className="text-xs text-gray-500">
          {formatDate(video?.snippet?.publishedAt)}
        </p>
      </div>
    </animated.div>
  );
};

export default VideoCard;
