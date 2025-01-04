import React, { useState } from "react";
import { signOut } from "firebase/auth";
import useGetUser from "../../hooks/useGetUser";
import { auth } from "../../firebase/firebase";
import "flowbite";

const Avatar = () => {
  const { user, loading } = useGetUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Sign out error:", error.message);
    }
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {user && (
        <div>
          <div className="relative">
            <img
              id="avatarButton"
              type="button"
              className="w-10 h-10 rounded-full cursor-pointer"
              src={user.photoURL || "default-avatar/default-avatar.png"}
              alt="User dropdown"
              onClick={toggleDropdown}
            />
            {user.auth ? (
              <span className="bottom-0 left-7 absolute w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
            ) : (
              <span className="bottom-0 left-7 absolute w-3.5 h-3.5 bg-red-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
            )}
          </div>
          <div>
            <div
              id="userDropdown"
              className={`z-50 ${
                isOpen ? "absolute" : "hidden"
              } bg-white divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}
            >
              <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                <div>{user.displayName}</div>
                <div className="font-medium text-xs truncate">{user.email}</div>
              </div>
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="avatarButton"
              >
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/settings"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Settings
                  </a>
                </li>
              </ul>
              <div>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white rounded-b-lg font-semibold w-full text-left"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Avatar;
