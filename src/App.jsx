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
import Forum from "./pages/Forum/Forum";
import PostDetail from "./pages/Forum/PostDetail";
import PostForm from "./pages/Forum/PostForm";
import useAuth from "./hooks/useAuth";

function App() {
  const { user, loading } = useGetUser();
  const { isAdmin } = useAuth();
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

        {/* Forum Routes */}
        <Route path="/forum" element={<Forum />} />
        <Route path="/forum/post/:postId" element={<PostDetail />} />
        {isAdmin && (
          <>
            <Route path="/forum/new" element={<PostForm />} />
            <Route path="/forum/edit/:postId" element={<PostForm />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
