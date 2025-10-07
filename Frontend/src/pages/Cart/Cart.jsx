import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../components/Context/StoreContext";
import { medicine_list } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart } = useContext(StoreContext);
  const navigate = useNavigate();

  const DELIVERY_FEE = 50;

  // Calculate total cart amount
  const getTotalCartAmount = () => {
    return medicine_list.reduce((total, item) => {
      if (cartItems[item._id]) {
        return total + item.price * cartItems[item._id];
      }
      return total;
    }, 0);
  };

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : DELIVERY_FEE;
  const grandTotal = subtotal + deliveryFee;

  return (
    <div className="cart">
      {/* ---------------- CART ITEMS ---------------- */}
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        <hr />

        {Object.keys(cartItems).length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "1rem" }}>
            Your cart is empty 🛒
          </p>
        ) : (
          medicine_list.map(
            (item) =>
              cartItems[item._id] && (
                <div key={item._id} className="card-items-item">
                  {/* Image */}
                  <div className="image-box">
                    <img src={item.image} alt={item.name} />
                  </div>

                  {/* Title */}
                  <p className="title">{item.name}</p>

                  {/* Price */}
                  <p className="price">₹{item.price}</p>

                  {/* Quantity */}
                  <p className="quantity">{cartItems[item._id]}</p>

                  {/* Total */}
                  <p className="total">₹{item.price * cartItems[item._id]}</p>

                  {/* Remove Button */}
                  <p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="remove-btn"
                    >
                      &times;
                    </button>
                  </p>
                </div>
              )
          )
        )}
      </div>

      {/* ---------------- CART TOTALS ---------------- */}
      <div className="cart-bottom">
        <h2>Cart Totals</h2>
        <div>
          <div className="cart-totals-item">
            <p>Subtotal</p>
            <p>₹{subtotal}</p>
          </div>
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹{deliveryFee}</p>
          </div>
          <div className="cart-total-details">
            <b>Total</b>
            <b>₹{grandTotal}</b>
          </div>
        </div>

        <button
          onClick={() => navigate("/placeorder")}
          disabled={subtotal === 0}
        >
          PROCEED TO CHECKOUT
        </button>
      </div>

      {/* ---------------- PROMO CODE ---------------- */}
      <div className="cart-promocode">
        <p>If you have a promo code, enter it here</p>
        <div className="cart-promocode-input">
          <input type="text" placeholder="Promo code" />
          <button>Apply</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
