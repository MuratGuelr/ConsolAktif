import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import NotFound from "./pages/NotFound/NotFound";
import useGetUser from "./hooks/useGetUser";
import Spinner from "./components/Spinner/Spinner";
import Settings from "./pages/Settings/Settings";
import AllApps from "./pages/Apps/AllApps";
import CreateApps from "./components/CreateApps/CreateApps";
import AllVideos from "./pages/AllVideos/AllVideos";
import AutoEditor from "./apps/AutoEditor";

function App() {
  const { user, loading } = useGetUser();

  console.log(user);

  if (loading) {
    return (
      <div className="bg-gray-900">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-gray-900">
      <Router>
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/apps" element={<AllApps />} />
              <Route path="/create-post" element={<CreateApps />} />
              <Route path="/all-videos" element={<AllVideos />} />
              <Route path="/auto-editor" element={<AutoEditor />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/signup" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
