// StoreContext.js
import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { assets } from "../../assets/assets";

export const StoreContext = createContext();

export const StoreContextProvider = ({ children }) => {
  // ✅ Use environment variable for API URL (supports prod + dev)
  const url = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const [token, setToken] = useState("");
  const [cartItems, setCartItems] = useState({});
  const [medicineList, setMedicineList] = useState([]);

  const currency = "₹";
  const deliveryCharge = 50;

  // --------------------------
  // Fetch medicine list
  // --------------------------
  const fetchMedicineList = useCallback(async () => {
    try {
      const res = await axios.get(`${url}/api/medicine/list`);
      setMedicineList(res.data.success ? res.data.data : assets.medicine_list || []);
    } catch (err) {
      console.error("Error fetching medicine list:", err.message);
      setMedicineList(assets.medicine_list || []);
    }
  }, [url]);

  // --------------------------
  // Load cart from backend
  // --------------------------
  const loadCartData = useCallback(
    async (authToken) => {
      try {
        const res = await axios.post(
          `${url}/api/cart/get`,
          {},
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        if (res.data.success) {
          setCartItems(res.data.cartData || {});
          localStorage.setItem("cartItems", JSON.stringify(res.data.cartData || {}));
        }
      } catch (err) {
        console.error("Error loading cart data:", err.message);
      }
    },
    [url]
  );

  // --------------------------
  // On mount: fetch medicine + token
  // --------------------------
  useEffect(() => {
    const init = async () => {
      await fetchMedicineList();

      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      } else {
        const storedCart = localStorage.getItem("cartItems");
        if (storedCart) setCartItems(JSON.parse(storedCart) || {});
      }
    };
    init();
  }, [fetchMedicineList, loadCartData]);

  // --------------------------
  // Sync cart to localStorage
  // --------------------------
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // --------------------------
  // Cart actions
  // --------------------------
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Error adding to cart:", err.message);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const qty = prev[itemId] || 0;
      if (qty <= 1) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: qty - 1 };
    });
    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Error removing from cart:", err.message);
      }
    }
  };

  const clearCart = async () => {
    setCartItems({});
    localStorage.removeItem("cartItems");
    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/clear`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Error clearing backend cart:", err.message);
      }
    }
  };

  // --------------------------
  // Cart helpers
  // --------------------------
  const getCartCount = useCallback(
    () => Object.values(cartItems).reduce((acc, qty) => acc + qty, 0),
    [cartItems]
  );

  const getTotalCartAmount = useCallback(
    () =>
      medicineList.reduce(
        (total, item) => total + (cartItems[item._id] || 0) * item.price,
        0
      ),
    [cartItems, medicineList]
  );

  // --------------------------
  // Context value
  // --------------------------
  const contextValue = useMemo(
    () => ({
      url,
      cartItems,
      setCartItems,
      addToCart,
      removeFromCart,
      clearCart,
      getCartCount,
      getTotalCartAmount,
      medicineList,
      token,
      setToken,
      currency,
      deliveryCharge,
    }),
    [
      url,
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      getCartCount,
      getTotalCartAmount,
      medicineList,
      token,
      currency,
      deliveryCharge,
    ]
  );

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
};
