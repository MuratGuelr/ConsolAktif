import React from "react";
import { IoMenu, IoApps } from "react-icons/io5";
import Avatar from "../../components/Avatar/Avatar";
import { useSpring, animated } from "@react-spring/web";

const Navbar = () => {
  // Logo animasyonu
  const logoSpring = useSpring({
    from: { opacity: 0, transform: "translateX(-20px)" },
    to: { opacity: 1, transform: "translateX(0)" },
    config: { tension: 300, friction: 20 },
  });

  // Apps butonu hover animasyonu
  const [appsProps, appsApi] = useSpring(() => ({
    scale: 1,
    config: { tension: 300, friction: 10 },
  }));

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-800 ">
      <div className="flex flex-wrap items-center justify-between mx-auto p-2 px-4">
        <animated.a
          href="/"
          style={logoSpring}
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src="logo/logo.png" className="h-8" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            ConsolAktif Apps
          </span>
        </animated.a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <animated.a
            href="/apps"
            style={appsProps}
            onMouseEnter={() => appsApi.start({ scale: 1.1 })}
            onMouseLeave={() => appsApi.start({ scale: 1 })}
            className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-2 text-center hover:text-gray-500 transition-all"
          >
            <IoApps size={25} />
          </animated.a>
          <div className="float-end">
            <Avatar />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
