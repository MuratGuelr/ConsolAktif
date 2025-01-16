import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useSpring, animated } from "@react-spring/web";
import "./index.css";
import App from "./App.jsx";
import Navbar from "./pages/Navbar/Navbar.jsx";
import Footer from "./pages/Footer/Footer.jsx";
import { ToastContainer } from "react-toastify";
import useGetYoutubeVideos from "./hooks/useGetYoutubeVideos";

function Root() {
  const [showNavbar, setShowNavbar] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const { loading } = useGetYoutubeVideos();

  // Navbar animasyonu
  const navbarAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(-50px)" },
    to: {
      opacity: showNavbar ? 1 : 0,
      transform: showNavbar ? "translateY(0px)" : "translateY(-50px)",
    },
    config: { tension: 280, friction: 20 },
  });

  // Content animasyonu
  const contentAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: showContent ? 1 : 0 },
    config: { tension: 280, friction: 20 },
  });

  // Footer animasyonu
  const footerAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(50px)" },
    to: {
      opacity: showFooter ? 1 : 0,
      transform: showFooter ? "translateY(0px)" : "translateY(50px)",
    },
    config: { tension: 280, friction: 20 },
  });

  useEffect(() => {
    if (!loading) {
      // Navbar ve content hemen yüklensin
      setShowNavbar(true);
      setShowContent(true);

      // Sadece footer gecikmeli yüklensin
      const footerTimer = setTimeout(() => {
        setShowFooter(true);
      }, 500);

      // Cleanup
      return () => {
        clearTimeout(footerTimer);
      };
    }
  }, [loading]);

  return (
    <StrictMode>
      <div className="bg-gray-900 dark:bg-gray-900 h-screen">
        <ToastContainer />
        <div className="min-h-screen flex flex-col">
          <animated.div style={navbarAnimation}>
            <Navbar />
          </animated.div>

          <animated.div style={contentAnimation}>
            <App />
          </animated.div>

          <animated.div style={footerAnimation}>
            <Footer />
          </animated.div>
        </div>
      </div>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
