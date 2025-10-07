// src/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Example: basic hello test
export const getHello = async () => {
  const res = await fetch(`${API_BASE_URL}/hello`);
  return res.json();
};

// Example: place order (POST)
export const placeOrder = async (orderData) => {
  const res = await fetch(`${API_BASE_URL}/placeOrder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  return res.json();
};

// Example: verify payment (POST)
export const verifyPayment = async (paymentData) => {
  const res = await fetch(`${API_BASE_URL}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentData),
  });
  return res.json();
};
