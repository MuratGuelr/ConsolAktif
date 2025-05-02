import React, { useState } from "react";
import { Link } from "react-router-dom";

const AppCard = ({ title, image, description, URL, isNew, category }) => {
  return (
    <div className="card bg-base-200 shadow-sm p-1">
      <Link to={URL}>
        <figure>
          <img src={image} alt={title} className="h-72 object-contain" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {title}
            {isNew && <div className="badge badge-secondary">Yeni</div>}
          </h2>
          <p>{description}</p>
          <div className="card-actions justify-end">
            {category &&
              category.map((cat, index) => (
                <div key={index} className="badge badge-outline">
                  {cat.category}
                </div>
              ))}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AppCard;
