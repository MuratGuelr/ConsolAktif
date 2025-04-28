import React from "react";
import Avatar from "../Avatar/Avatar";
import useGetUser from "../../hooks/useGetUser";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, loading } = useGetUser();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.log("Error", error.message);
    }
  };

  return (
    <div className="navbar bg-base-200 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          ConsolAktif
        </Link>
      </div>

      {!loading && !user && (
        <div className="flex gap-2">
          <Link to="/login" className="btn btn-primary">
            Giriş Yap
          </Link>
        </div>
      )}

      {!loading && user && (
        <div className="flex gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <Avatar />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profil
                  <span className="badge">Yeni</span>
                </Link>
              </li>
              <li>
                <Link to="/settings">Ayarlar</Link>{" "}
              </li>
              <li>
                <button onClick={handleSignOut}>Çıkış Yap</button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
