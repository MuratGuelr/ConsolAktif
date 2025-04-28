import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Login/Login";
import useGetUser from "./hooks/useGetUser";
import Profile from "./pages/Profile/Profile";
import Apps from "./pages/Apps/Apps";

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
      </Routes>
    </div>
  );
}

export default App;
