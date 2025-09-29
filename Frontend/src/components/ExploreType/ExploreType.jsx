import React from "react";
import "./ExploreType.css";
import { type_list, assets } from "../../assets/assets";

const ExploreType = ({ category, setCategory }) => {
  const handleImgError = (e) => {
    e.target.src = assets.placeholder;
  };

  return (
    <div className="explore-type" id="explore-type">
      <h1>Explore Our Types</h1>
      <p className="explore-type-text">
        Choose from a diverse menu featuring a wide array of medicines.
        Our mission is to provide trusted and reliable options for your healthcare needs.
      </p>

      <div className="explore-menu">
        {type_list.map((item, index) => (
          <button
            key={index}
            className={`explore-type-btn ${category === item.type_name ? "active" : ""}`}
            onClick={() =>
              setCategory(prev => prev === item.type_name ? "All" : item.type_name)
            }
          >
            <img
              src={item.type_image || assets.placeholder}
              alt={item.type_name}
              onError={handleImgError}
            />
            <span>{item.type_name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExploreType;
