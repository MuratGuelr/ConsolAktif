import React from "react";
import { Link } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";

const NotFound = () => {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 280, friction: 20 },
  });

  const bounce404 = useSpring({
    from: { transform: "scale(0.8)" },
    to: { transform: "scale(1)" },
    config: { tension: 300, friction: 10 },
  });

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center px-4 py-12">
        <animated.h1
          style={bounce404}
          className="text-9xl font-extrabold text-transparent bg-clip-text bg-red-600 mb-4 leading-none"
        >
          404
        </animated.h1>
        <animated.div style={fadeIn}>
          <h2 className="text-4xl font-bold text-gray-200 mb-4">
            Sayfa Bulunamadı
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl 
                     hover:from-blue-600 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 
                     shadow-lg hover:shadow-xl text-lg font-medium"
          >
            Ana Sayfaya Dön
          </Link>
        </animated.div>
      </div>
    </div>
  );
};

export default NotFound;
