import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Login/Login";
import useGetUser from "./hooks/useGetUser";
import Profile from "./pages/Profile/Profile";
import Apps from "./pages/Apps/Apps";
import AutoEditor from "./components/AppWebsites/AutoEditor";
import Youtility from "./components/AppWebsites/Youtility";
import FreeExtensions from "./components/AppWebsites/FreeExtensions";
import AppMarket from "./components/AppWebsites/AppMarket";
import Videos from "./pages/Videos/Videos";
import useGetYoutubeVideos from "./hooks/useGetYoutubeVideos";

function App() {
  const { user, loading } = useGetUser();
  const { videos, error } = useGetYoutubeVideos();

  console.log(user);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        {!user && <Route path="/login" element={<Login />} />}
        {user && <Route path="/profile" element={<Profile />} />}
        <Route path="/apps" element={<Apps />} />
        <Route path="/apps/auto-editor" element={<AutoEditor />} />
        <Route path="/apps/youtility" element={<Youtility />} />
        <Route path="/apps/free-extensions" element={<FreeExtensions />} />
        <Route path="/apps/app-market" element={<AppMarket />} />
        <Route path="/videos" element={<Videos />} />
      </Routes>
    </div>
  );
}

export default App;
