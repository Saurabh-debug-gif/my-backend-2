import React, { useContext } from "react";
import "./MedicineItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../components/Context/StoreContext";

const MedicineItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
  const quantity = cartItems[id] ?? 0;

  // Fallback if image fails
  const handleImgError = (e) => {
    console.warn("Image failed to load:", e.target.src);
    e.target.src = assets.placeholder;
  };

  return (
    <div className="medicine-item-card">
      <div className="medicine-item-img-container">
        <img
          className="medicine-item-img"
          src={image}  
          alt={name}
          onError={handleImgError}
        />

        {quantity === 0 ? (
          <img
            className="add-button"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt="Add"
            style={{ cursor: "pointer" }}
          />
        ) : (
          <div className="medicine-item-add">
            <button type="button" onClick={() => removeFromCart(id)}>-</button>
            <span>{quantity}</span>
            <button type="button" onClick={() => addToCart(id)}>+</button>
          </div>
        )}
      </div>

      <div className="medicine-item-details">
        <p className="medicine-item-name">{name}</p>
        <p className="medicine-item-desc">{description}</p>
        <p className="medicine-item-price">₹{price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default MedicineItem;
