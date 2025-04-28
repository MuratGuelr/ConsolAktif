import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Footer from "./pages/Footer/Footer.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <App />
      <Footer />
    </BrowserRouter>
  </StrictMode>
);
