import React, { useState } from "react";
import Avatar from "../Avatar/Avatar";

const Navbar = () => {
  const [user, setUser] = useState(false);

  return (
    <div className="navbar bg-base-200 shadow-sm">
      <div className="flex-1">
        <a href="/" className="btn btn-ghost text-xl">
          ConsolAktif
        </a>
      </div>

      {!user && (
        <div className="flex gap-2">
          <a href="login">
            <button className="btn btn-soft btn-primary">Giriş Yap</button>
          </a>
        </div>
      )}

      {user && (
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
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profil
                  <span className="badge">Yeni</span>
                </a>
              </li>
              <li>
                <a>Ayarlar</a>
              </li>
              <li>
                <a>Çıkış Yap</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
