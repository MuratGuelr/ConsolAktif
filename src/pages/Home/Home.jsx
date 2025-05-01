import React, { useEffect } from "react";
import Hero from "../../components/Hero/Hero";

const Home = () => {
  useEffect(() => {
    document.title = "ConsolAktif Anasayfa";
    const favicon = document.querySelector("link[rel~='icon']");
    if (favicon) {
      favicon.href = "/logo/logo.png";
    }
  }, []);

  return (
    <div>
      <Hero />
    </div>
  );
};

export default Home;
