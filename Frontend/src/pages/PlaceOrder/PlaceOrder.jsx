import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PlaceOrder.css";
import { StoreContext } from "../../components/Context/StoreContext";
import { medicine_list } from "../../assets/assets";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";

const PlaceOrder = () => {
  const {
    cartItems,
    token,
    url,
    currency,
    deliveryCharge,
    clearCart,
  } = useContext(StoreContext);

  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(false);

  // --------------------------
  // Compute subtotal & total
  // --------------------------
  const subtotal = (medicine_list || []).reduce(
    (total, med) => total + (cartItems[med._id] || 0) * med.price,
    0
  );
  const total = subtotal + (subtotal ? Number(deliveryCharge) : 0);

  // --------------------------
  // Calculate total cart amount
  // --------------------------
  const getTotalCartAmount = () => subtotal;

  // --------------------------
  // Redirect if not logged in or cart empty
  // --------------------------
  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, cartItems, navigate]);

  // --------------------------
  // Handle input changes
  // --------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --------------------------
  // Handle order submission
  // --------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("⚠️ You must be logged in!");
    if (!subtotal) return alert("🛒 Your cart is empty!");

    setLoading(true);

    try {
      // Prepare items
      const items = Object.keys(cartItems)
        .filter((id) => cartItems[id] > 0)
        .map((id) => {
          const med = medicine_list.find((m) => m._id === id);
          return {
            productId: id,
            name: med?.name || "Unknown",
            price: med?.price || 0,
            quantity: cartItems[id],
          };
        });

      // Step 1: Place order
      const { data } = await axios.post(
        `${url}/api/orders/place`,
        { items, amount: total, address: formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!data.success) {
        alert("❌ Failed to create order. Please try again.");
        setLoading(false);
        return;
      }

      const { paymentSessionId, session_url, paymentUrl } = data;

      // Step 2: Cashfree payment
      if (paymentSessionId) {
        try {
          const cashfree = await load({ mode: "sandbox" }); // change to "production" later
          if (!cashfree) {
            alert("Cashfree SDK not loaded properly!");
            setLoading(false);
            return;
          }

          const result = await cashfree.checkout({
            paymentSessionId,
            redirectTarget: "_blank",
          });

          if (result.redirect === true) {
            console.log("Redirecting to Cashfree...");
          } else {
            console.error("Cashfree checkout failed:", result);
            alert("Payment could not be initiated. Try again.");
          }
        } catch (err) {
          console.error("Cashfree SDK error:", err);
          alert("Payment could not be initiated. Try again.");
          setLoading(false);
          return;
        }
      } else if (session_url || paymentUrl) {
        window.location.href = session_url || paymentUrl;
        return;
      }

      // Step 3: Success fallback
      clearCart();
      alert("🎉 Order placed successfully!");
      navigate("/order-success");
    } catch (err) {
      console.error("❌ Order placement failed:", err.response?.data || err.message);
      alert("🚨 Something went wrong while placing your order!");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // Render UI
  // --------------------------
  return (
    <form className="place-order" onSubmit={handleSubmit}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input
            required
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            required
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <input
          required
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          required
          name="street"
          placeholder="Street"
          value={formData.street}
          onChange={handleChange}
        />

        <div className="multi-fields">
          <input
            required
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
          />
          <input
            required
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
          />
        </div>

        <div className="multi-fields">
          <input
            required
            name="zip"
            placeholder="Zip code"
            value={formData.zip}
            onChange={handleChange}
          />
          <input
            required
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
          />
        </div>

        <input
          required
          name="phone"
          placeholder="Phone number"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="place-order-right">
        <div className="cart-bottom">
          <h2>Cart Totals</h2>

          <div className="order-items">
            {(medicine_list || [])
              .filter((m) => (cartItems[m._id] || 0) > 0)
              .map((m) => (
                <div key={m._id} className="order-item">
                  <span>
                    {m.name} × {cartItems[m._id]}
                  </span>
                  <span>
                    {currency} {(m.price * cartItems[m._id]).toFixed(2)}
                  </span>
                </div>
              ))}
          </div>

          <div className="cart-totals-item">
            <p>Subtotal</p>
            <p>
              {currency} {subtotal.toFixed(2)}
            </p>
          </div>

          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>
              {subtotal
                ? `${currency}${deliveryCharge.toFixed(2)}`
                : `${currency}0.00`}
            </p>
          </div>

          <div className="cart-total-details total">
            <b>Total</b>
            <b>
              {currency} {total.toFixed(2)}
            </b>
          </div>

          <button type="submit" disabled={!subtotal || loading}>
            {loading ? "Processing..." : "PROCEED TO PAYMENT"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
