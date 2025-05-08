// src/components/AppCard/AppCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const AppCard = ({ app }) => {
  if (!app) {
    // Skeleton loader
    return (
      <div className="card bg-base-200 shadow-sm animate-pulse">
        <div className="aspect-[4/3] bg-gray-300 w-full rounded-t-lg"></div>
        <div className="card-body p-4">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
          <div className="flex gap-2">
            <div className="badge badge-outline h-5 w-16 bg-gray-300"></div>
          </div>
        </div>
      </div>
    );
  }

  // Prop'ları doğrudan app objesinden alalım
  const { id, title, image, description, URL, isNew, displayCategories } = app;

  return (
    <Link
      to={URL}
      className="card bg-base-300 shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full group"
      aria-label={`Detayları gör: ${title}`}
    >
      <figure className="aspect-video bg-gray-50 dark:bg-gray-800 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain p-3 sm:p-4 group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.onerror = null; // Sonsuz döngüyü engelle
            e.currentTarget.src = "/images/placeholder-app-icon.png"; // Varsayılan bir placeholder
          }}
        />
      </figure>
      <div className="card-body p-3 sm:p-4 flex-grow flex flex-col">
        <h2
          className="card-title text-md sm:text-lg line-clamp-2"
          title={title}
        >
          {title}
          {isNew && (
            <div className="badge badge-secondary badge-sm ml-2">YENİ</div>
          )}
        </h2>
        {description && (
          <p className="text-xs sm:text-sm text-base-content-secondary line-clamp-2 mt-1 mb-2 flex-grow">
            {description}
          </p>
        )}
        <div className="card-actions justify-start mt-auto pt-1">
          {displayCategories &&
            displayCategories.length > 0 &&
            displayCategories.slice(0, 2).map(
              (
                cat,
                index // En fazla 2 kategori göster
              ) => (
                <div
                  key={index}
                  className="badge badge-outline badge-xs sm:badge-sm"
                >
                  {cat}
                </div>
              )
            )}
        </div>
      </div>
    </Link>
  );
};

export default AppCard;
