import { useState } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import VideoCard from "../VideoCard/VideoCard";

const VideoController = ({
  videos,
  gridCount,
  setGridCount,
  loading,
  error,
}) => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalVideos = videos?.length || 0;
  const filteredVideos = videos.slice(0, itemsPerPage);

  // Jumbotron tarzı animasyon
  const controllerSpring = useSpring({
    from: { opacity: 0, transform: "translateY(-50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 300, friction: 10 },
  });

  // Grid için aynı config
  const gridSpring = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 300, friction: 10 },
  });

  return (
    <div className="p-6">
      {/* Kontrol Paneli */}
      <animated.div
        style={controllerSpring}
        className="mb-6 p-4 rounded-lg shadow-sm"
      >
        <div className="flex flex-wrap gap-6 items-center justify-between">
          {/* Grid Kontrolü */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Grid Boyutu:</label>
            <input
              type="range"
              min="1"
              max="4"
              value={gridCount}
              onChange={(e) => setGridCount(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-sm text-gray-600">{gridCount}</span>
          </div>

          {/* Sayfa Başına Video Sayısı */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Sayfa Başına Video:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={totalVideos}>Tümü</option>
            </select>
          </div>
        </div>
      </animated.div>

      <animated.div
        style={gridSpring}
        className={`grid grid-cols-${gridCount} gap-6 p-5`}
      >
        {filteredVideos?.map((video) => (
          <VideoCard
            key={video.id}
            loading={loading}
            error={error}
            video={video}
          />
        ))}
      </animated.div>

      {/* Alt Bilgi */}
      <div className="mt-6 text-center text-sm text-gray-600">
        Görüntülenen: {Math.min(itemsPerPage, totalVideos)} / {totalVideos}{" "}
        video
      </div>
    </div>
  );
};

export default VideoController;
