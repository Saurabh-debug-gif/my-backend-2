// src/pages/PlaceOrder/PlaceOrder.jsx
import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../components/Context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const {
    cartItems,
    medicineList,
    getTotalCartAmount,
    clearCart,
    token,
    url,
    currency,
    deliveryCharge,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  // Totals
  const subtotal = getTotalCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + deliveryCharge;

  // Delivery form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (subtotal === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      // ✅ Build order items strictly from medicineList
      const items = medicineList
        .filter((med) => cartItems[med._id] > 0)
        .map((med) => ({
          id: med._id,
          name: med.name,
          price: med.price,
          quantity: cartItems[med._id],
          total: med.price * cartItems[med._id],
        }));

      const orderData = {
        items,
        amount: total,
        address: formData,
      };

      const res = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        window.location.href = res.data.session_url; // Stripe checkout
      } else {
        alert("❌ Failed to place order. Try again!");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      alert("⚠️ Something went wrong. Please try again later.");
    }
  };

  return (
    <form className="place-order" onSubmit={handleSubmit}>
      {/* Left side: Delivery form */}
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="street"
          placeholder="Street"
          value={formData.street}
          onChange={handleChange}
          required
        />

        <div className="multi-fields">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>

        <div className="multi-fields">
          <input
            type="text"
            name="zip"
            placeholder="Zip code"
            value={formData.zip}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>

        <input
          type="text"
          name="phone"
          placeholder="Phone number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      {/* Right side: Cart summary */}
      <div className="place-order-right">
        <div className="cart-bottom">
          <h2>Cart Totals</h2>

          {/* ✅ Show only valid medicines */}
          <div className="order-items">
            {medicineList
              .filter((med) => cartItems[med._id] > 0)
              .map((med) => (
                <div key={med._id} className="order-item">
                  <span>
                    {med.name} × {cartItems[med._id]}
                  </span>
                  <span>
                    {currency}
                    {med.price * cartItems[med._id]}
                  </span>
                </div>
              ))}
          </div>

          {/* Totals */}
          <div className="cart-totals-item">
            <p>Subtotal</p>
            <p>
              {currency}
              {subtotal}
            </p>
          </div>

          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>
              {subtotal === 0
                ? `${currency}0`
                : `${currency}${deliveryCharge}`}
            </p>
          </div>

          <div className="cart-total-details">
            <b>Total</b>
            <b>
              {currency}
              {total}
            </b>
          </div>

          <button type="submit" disabled={subtotal === 0}>
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
