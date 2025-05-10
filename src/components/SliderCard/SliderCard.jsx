import React from "react";
import { Link } from "react-router-dom";

const SliderCard = ({ solution }) => {
  if (!solution) return null;

  return (
    <div className="card w-full h-64 sm:h-80 glass shadow-lg relative overflow-hidden group">
      <figure className="h-full">
        <img
          src={solution.imageUrl || "https://i.imgur.com/enSHcEv.jpeg"}
          alt={solution.title || "Çözüm Görseli"}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
      </figure>
      <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-60 transition-opacity duration-300 p-4 flex flex-col justify-end">
        <h2
          className="card-title text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 truncate"
          title={solution.title}
        >
          {solution.title || "Başlıksız Çözüm"}
        </h2>
        <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 mb-2 sm:mb-3">
          {solution.shortDescription || "Açıklama mevcut değil."}
        </p>
        <div className="card-actions justify-start">
          <Link
            to={`/forum/solution/${solution.id}`}
            className="btn btn-primary btn-xs sm:btn-sm"
          >
            Detayları Gör
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SliderCard;
