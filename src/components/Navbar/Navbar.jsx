import React from "react";
import { Link, NavLink } from "react-router-dom";
import useGetUser from "../../hooks/useGetUser"; // To show login/profile links
import { getAuth, signOut } from "firebase/auth";
import {
  FaComments,
  FaUserCircle,
  FaSignInAlt,
  FaSignOutAlt,
  FaHome,
  FaPlusCircle,
} from "react-icons/fa"; // Example icons

import { LuAppWindow } from "react-icons/lu";

const Navbar = () => {
  const { user } = useGetUser();
  const auth = getAuth();
  const isAdmin = user && user.email === import.meta.env.VITE_ADMIN_MAILS;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Kullanıcı çıkış yaptı");
    } catch (error) {
      console.error("Çıkış yapılamadı", error);
    }
  };

  const activeClassName = "bg-primary text-primary-content"; // DaisyUI active class for NavLink
  const normalClassName = "hover:bg-base-content hover:bg-base-content/20";

  return (
    <div className="navbar bg-base-200 shadow-md sticky top-0 z-50 px-4 sm:px-6">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          {/* Mobile Menu */}
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? activeClassName : normalClassName
                }
              >
                <FaHome className="mr-1" /> Ana Sayfa
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/apps"
                className={({ isActive }) =>
                  isActive ? activeClassName : normalClassName
                }
              >
                <LuAppWindow className="mr-1" /> Uygulamalar
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/forum"
                className={({ isActive }) =>
                  isActive ? activeClassName : normalClassName
                }
              >
                <FaComments className="mr-1" /> Forum
              </NavLink>
            </li>
            {isAdmin && (
              <li>
                <NavLink
                  to="/admin/add-solution"
                  className={({ isActive }) =>
                    isActive ? activeClassName : normalClassName
                  }
                >
                  <FaPlusCircle className="mr-1" /> Çözüm Ekle
                </NavLink>
              </li>
            )}
            {/* Add other mobile links if needed */}
          </ul>
        </div>
        <Link
          to="/"
          className="btn btn-ghost normal-case text-xl font-bold text-primary"
        >
          ConsolAktif
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal p-0">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? `${activeClassName} rounded-md`
                  : `${normalClassName} rounded-md`
              }
            >
              <FaHome className="mr-1" /> Ana Sayfa
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/apps"
              className={({ isActive }) =>
                isActive ? activeClassName : normalClassName
              }
            >
              <LuAppWindow className="mr-1" /> Uygulamalar
            </NavLink>
          </li>
          <li className="mx-1">
            <NavLink
              to="/forum"
              className={({ isActive }) =>
                isActive
                  ? `${activeClassName} rounded-md`
                  : `${normalClassName} rounded-md`
              }
            >
              <FaComments className="mr-1" /> Forum
            </NavLink>
          </li>
          {isAdmin && (
            <li className="mx-1">
              <NavLink
                to="/admin/add-solution"
                className={({ isActive }) =>
                  isActive
                    ? `${activeClassName} rounded-md`
                    : `${normalClassName} rounded-md`
                }
              >
                <FaPlusCircle className="mr-1" /> Çözüm Ekle
              </NavLink>
            </li>
          )}
          {/* Add other desktop links if needed */}
        </ul>
      </div>

      <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              {user.photoURL ? (
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={user.photoURL}
                    alt={user.displayName || user.email}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center ring ring-primary ring-offset-base-100 ring-offset-2">
                  <FaUserCircle size={24} />
                </div>
              )}
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive ? activeClassName : normalClassName
                  }
                >
                  Profil
                </NavLink>
              </li>
              {/* Add more user-specific links here if needed */}
              <li>
                <button
                  onClick={handleLogout}
                  className={`${normalClassName} w-full text-left`}
                >
                  <FaSignOutAlt className="mr-1" /> Çıkış Yap
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `${isActive ? activeClassName : normalClassName} btn btn-ghost`
            }
          >
            <FaSignInAlt className="mr-1" /> Giriş Yap
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Navbar;
