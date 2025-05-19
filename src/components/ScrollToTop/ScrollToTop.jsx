import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Ani geçiş için
    });
  }, [pathname]);

  return null; // Bu bileşen herhangi bir UI öğesi render etmiyor
}

export default ScrollToTop;
