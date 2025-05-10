import React from "react";
import { Link } from "react-router-dom";

const SliderCard = ({ solution }) => {
  if (!solution) return null;

  // console.log("SliderCard solution:", solution);
  // console.log("SliderCard imageUrl:", solution.imageUrl);

  const displayImageUrl =
    solution.imageUrl || "https://i.imgur.com/enSHcEv.jpeg";
  const displayTitle = solution.title || "Başlıksız Çözüm";
  const displayDescription =
    solution.shortDescription || "Açıklama mevcut değil.";

  return (
    // Ensure the card itself has a defined height and width, which it does (h-64 sm:h-80 and w-full)
    <div className="card w-full h-64 sm:h-80 glass shadow-lg relative overflow-hidden group">
      {/* Ensure figure takes full space of its parent (the card) */}
      <figure className="absolute inset-0 w-full h-full">
        {" "}
        {/* Changed to absolute and inset-0 */}
        <img
          src={displayImageUrl}
          alt={displayTitle}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 block" // Added block
          style={{ display: "block", width: "100%", height: "100%" }} // Added inline styles for emphasis
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://i.imgur.com/enSHcEv.jpeg";
            console.warn(
              `SliderCard: Image failed to load: ${displayImageUrl}. Falling back to default placeholder.`
            );
          }}
        />
      </figure>
      {/* Text content overlay */}
      <div className="absolute inset-0 transition-opacity duration-300 p-4 flex flex-col justify-end z-10 text-shadow-lg">
        <Link to={`/forum/solution/${solution.id}`} className="z-10">
          {" "}
          {/* Added z-10 */}
          <h2
            className="card-title text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 line-clamp-2"
            title={displayTitle}
            style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
          >
            {displayTitle}
          </h2>
          <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 mb-2 sm:mb-3">
            {displayDescription}
          </p>
        </Link>
      </div>
    </div>
  );
};

export default SliderCard;
