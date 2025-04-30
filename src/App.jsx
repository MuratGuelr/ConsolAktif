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

function App() {
  const { user, loading } = useGetUser();

  console.log(user);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        {!user && <Route path="/login" element={<Login />} />}
        {user && <Route path="/profile" element={<Profile />} />}
        <Route path="/apps" element={<Apps />} />
        <Route path="/auto-editor" element={<AutoEditor />} />
        <Route path="/youtility" element={<Youtility />} />
      </Routes>
    </div>
  );
}

export default App;
