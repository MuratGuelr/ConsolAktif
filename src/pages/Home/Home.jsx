import React from "react";
import ImageSlider from "../../components/ImageSlider/ImageSlider";
import Jumbotron from "../../components/Jumbotron/Jumbotron";
import useGetYoutubeVideos from "../../hooks/useGetYoutubeVideos";
import { useSpring, animated, config } from "@react-spring/web";

const Home = () => {
  const { videos, loading, error } = useGetYoutubeVideos();

  // Ana container animasyonu
  const containerSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.gentle,
  });

  // Jumbotron için animasyon
  const jumbotronSpring = useSpring({
    from: { opacity: 0, transform: "translateY(50px)" },
    to: {
      opacity: !loading ? 1 : 0,
      transform: !loading ? "translateY(0px)" : "translateY(50px)",
    },
    config: { tension: 280, friction: 20 },
    delay: 300,
  });

  return (
    <animated.div style={containerSpring} className="bg-white dark:bg-gray-900">
      <ImageSlider videos={videos} loading={loading} error={error} />
      <animated.div style={jumbotronSpring}>
        <Jumbotron />
      </animated.div>
    </animated.div>
  );
};

export default Home;
