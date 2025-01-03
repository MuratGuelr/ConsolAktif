import React from "react";
import ImageSlider from "../../components/ImageSlider/ImageSlider";
import Jumbotron from "../../components/Jumbotron/Jumbotron";

const Home = () => {

  return (
    <div className="bg-white dark:bg-gray-900">
      <ImageSlider />
      <Jumbotron />
    </div>
  );
};

export default Home;
