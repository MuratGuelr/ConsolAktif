import React from "react";
import { Link } from "react-router-dom";

const SolutionCard = ({ solution }) => {
  const { id, title, shortDescription, imageUrl, category } = solution;

  const placeholderTitle = "Başlık Yok";
  const placeholderImage = `https://via.placeholder.com/600x400?text=${encodeURIComponent(
    "Görsel Yok"
  )}`;
  const placeholderDescription =
    "Kısa açıklama bulunmamaktadır. Detaylar için tıklayınız.";

  const displayTitle = title || placeholderTitle;
  const displayImageUrl = imageUrl || placeholderImage;
  const displayDescription = shortDescription || placeholderDescription;

  // Ensure solution object and its id are valid before creating a link
  if (!solution || !solution.id) {
    // Fallback for cases where solution or solution.id is missing, though ideally this shouldn't happen with Firestore data
    return (
      <div className="card card-compact w-full bg-base-100 shadow-xl animate-pulse">
        <figure className="bg-gray-300 h-48"></figure>
        <div className="card-body">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
          <div className="card-actions justify-end">
            <div className="btn btn-primary disabled h-10 w-28 bg-gray-400"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-300 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out rounded-xl overflow-hidden group">
      <figure className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={displayImageUrl}
          alt={displayTitle}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {category && (
          <div className="absolute top-3 right-3 badge badge-success badge-lg py-3 px-3 text-xs font-semibold tracking-wider">
            {category.toUpperCase()}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300"></div>
      </figure>
      <div className="card-body p-5 md:p-5 flex flex-col">
        <h2
          className="card-title text-lg md:text-xl font-bold leading-tight text-base-content hover:text-success transition-colors duration-200 min-h-[4.2em]"
          title={displayTitle}
        >
          {displayTitle}
        </h2>
        <p className="text-sm text-base-content opacity-70 min-h-[3.5em] line-clamp-4 flex-grow">
          {displayDescription}
        </p>
        <div className="card-actions justify-end mt-auto">
          <Link
            to={`/forum/solution/${id}`}
            className="btn btn-success btn-md hover:bg-green-600 hover:border-green-600 transition-colors duration-300 group-hover:scale-105 transform"
          >
            Detayları Gör
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SolutionCard;
