import React from "react";

const Loader = ({ size = "default" }) => {
  const sizeClass =
    {
      small: "w-6 h-6",
      default: "w-12 h-12",
      large: "w-16 h-16",
    }[size] || "w-12 h-12";

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClass} border-4 border-primary border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default Loader;
