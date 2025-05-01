import React from "react";

const Header = ({ title, subtitle }) => {
  return (
    <div className="text-center lg:text-center py-10 -mb-3">
      <h1 className="text-5xl font-bold">{title}</h1>
      <p className="py-4">{subtitle}</p>
    </div>
  );
};

export default Header;
