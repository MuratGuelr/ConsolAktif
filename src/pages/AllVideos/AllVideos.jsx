import React, { useState } from "react";
import useGetYoutubeVideos from "../../hooks/useGetYoutubeVideos";
import VideoController from "../../components/VideoController/VideoController";

const AllVideos = () => {
  const [gridCount, setGridCount] = useState(3);

  const { videos, loading, error } = useGetYoutubeVideos();

  return (
    <div>
      <VideoController
        videos={videos}
        gridCount={gridCount}
        setGridCount={setGridCount}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default AllVideos;
