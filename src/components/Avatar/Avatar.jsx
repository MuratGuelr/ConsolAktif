import React, { useState } from "react";
import { signOut } from "firebase/auth";
import useGetUser from "../../hooks/useGetUser";
import { auth } from "../../firebase/firebase";
import { useSpring, animated, config } from "@react-spring/web";
import "flowbite";

const Avatar = () => {
  const { user, loading } = useGetUser();
  const [isOpen, setIsOpen] = useState(false);

  // Avatar image animasyonu
  const avatarSpring = useSpring({
    from: { scale: 0, rotate: -180 },
    to: { scale: 1, rotate: 0 },
    config: config.gentle,
  });

  // Status dot animasyonu
  const statusSpring = useSpring({
    from: { scale: 0, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    delay: 300,
    config: { tension: 300, friction: 10 },
  });

  // Dropdown menu animasyonu
  const dropdownSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "translateY(0)" : "translateY(-10px)",
    config: { tension: 300, friction: 20 },
  });

  // Hover animasyonu için
  const [hoverProps, hoverApi] = useSpring(() => ({
    scale: 1,
    config: { tension: 300, friction: 10 },
  }));

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
            <animated.img
              id="avatarButton"
              type="button"
              style={{
                ...avatarSpring,
                ...hoverProps,
              }}
              onMouseEnter={() => hoverApi.start({ scale: 1.1 })}
              onMouseLeave={() => hoverApi.start({ scale: 1 })}
              className="w-10 h-10 rounded-full cursor-pointer"
              src={user.photoURL || "default-avatar/default-avatar.png"}
              alt="User dropdown"
              onClick={toggleDropdown}
            />
            <animated.span
              style={statusSpring}
              className={`bottom-0 left-7 absolute w-3.5 h-3.5 ${
                user.auth ? "bg-green-500" : "bg-red-500"
              } border-2 border-white dark:border-gray-800 rounded-full`}
            />
          </div>
          <animated.div
            style={dropdownSpring}
            className={`${
              isOpen ? "fixed z-[9999] !important" : "hidden"
            } bg-white divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 top-14 right-2 sm:right-auto sm:left-2`}
          >
            <animated.div
              style={{
                opacity: dropdownSpring.opacity,
                transform: dropdownSpring.opacity.to(
                  (o) => `scale(${0.9 + o * 0.1})`
                ),
              }}
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
                    href="/create-post"
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
            </animated.div>
          </animated.div>
        </div>
      )}
    </>
  );
};

export default Avatar;
