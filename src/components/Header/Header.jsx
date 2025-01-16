import React from "react";

const Header = ({ title }) => {
  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center">
        {title}
      </h1>
    </div>
  );
};

export default Header;
