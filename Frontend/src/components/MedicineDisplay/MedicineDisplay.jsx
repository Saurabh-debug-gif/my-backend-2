import React, { useState } from "react";
import { medicine_list } from "../../assets/assets";
import MedicineItem from "../MedicineItem/MedicineItem";
import "./MedicineDisplay.css";

const MedicineDisplay = () => {
  const [category, setCategory] = useState("All");

  const filteredList =
    category === "All"
      ? medicine_list
      : medicine_list.filter((item) => item.category === category);

  const categories = [
    "All",
    "Antibiotics",
    "Analgesics",
    "Antipyretics",
    "Antivirals",
    "Antifungals",
    "Antihistamines",
    "Hormones & Hormone Modulators",
    "Vaccines & Immunomodulators",
  ];

  return (
    <div className="medicine-display" id="medicine-display">
      <h2>Medicines Available</h2>

      {/* CATEGORY FILTER */}
      <div className="category-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            className={category === cat ? "active" : ""}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MEDICINE LIST */}
      <div className="medicine-display-list">
        {filteredList.length > 0 ? (
          filteredList.map((item) => (
            <MedicineItem
              key={item.id || item._id} // support both DB _id or manual id
              id={item.id || item._id}
              name={item.name}
              price={item.price}
              description={item.description}
              image={item.image} // ✅ passes filename (e.g. medicine_1.png)
            />
          ))
        ) : (
          <p className="no-medicine-text">
            No medicines available in this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default MedicineDisplay;

