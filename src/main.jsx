import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Navbar from "./pages/Navbar/Navbar.jsx";
import Footer from "./pages/Footer/Footer.jsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="bg-gray-900 dark:bg-gray-900 h-screen">
      <ToastContainer />
      <Navbar />
      <App />
      <Footer />
    </div>
  </StrictMode>
);
