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
import ForumPage from "./pages/ForumPage/ForumPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import SolutionDetailPage from "./pages/SolutionDetailPage/SolutionDetailPage";
import EditSolutionPage from "./pages/AdminPage/EditSolutionPage";
import News from "./pages/News/News";

function App() {
  const { user, loading } = useGetUser();
  const isAdmin = user && user.email === import.meta.env.VITE_ADMIN_MAILS;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-lg loading-spinner text-primary"></span>
      </div>
    );
  }

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
        <Route path="/news" element={<News />} />

        {/* Forum Routes */}
        <Route path="/forum" element={<ForumPage />} />
        <Route
          path="/forum/solution/:solutionId"
          element={<SolutionDetailPage />}
        />

        {/* Admin Routes */}
        {isAdmin && (
          <Route path="/admin/add-solution" element={<AdminPage />} />
        )}
        {isAdmin && (
          <Route
            path="/admin/edit-solution/:solutionId"
            element={<EditSolutionPage />}
          />
        )}
      </Routes>
    </div>
  );
}

export default App;
