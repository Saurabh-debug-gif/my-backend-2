import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { assets } from "../../assets/assets";

export const StoreContext = createContext();

export const StoreContextProvider = ({ children }) => {
  const url = "http://localhost:4000";

  const [token, setToken] = useState("");
  const [cartItems, setCartItems] = useState({});
  const [medicineList, setMedicineList] = useState([]);

  const currency = "₹";
  const deliveryCharge = 50;

  // ---------------- Load Medicines ----------------
  const fetchMedicineList = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/api/medicine/list`);
      setMedicineList(response.data.data || []);
    } catch (err) {
      console.error("Error fetching medicine list:", err);
      setMedicineList(assets.medicine_list || []);
    }
  }, [url]);

  // ---------------- Sync Cart from Backend ----------------
  const fetchUserCart = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { Authorization: `Bearer ${token}` } } // ✅ fixed
      );
      const backendCart = res.data.cartData || {};

      // Merge backend cart with localStorage cart
      const storedCart = JSON.parse(localStorage.getItem("cartItems") || "{}");
      const mergedCart = { ...storedCart, ...backendCart };

      setCartItems(mergedCart);
      localStorage.setItem("cartItems", JSON.stringify(mergedCart));
    } catch (err) {
      console.error("Error fetching user cart:", err);
    }
  }, [token, url]);

  // ---------------- Load Medicines + Token + Cart on Mount ----------------
  useEffect(() => {
    fetchMedicineList();

    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch {
        setCartItems({});
      }
    }

    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, [fetchMedicineList]);

  // ---------------- Load Cart After Token is Set ----------------
  useEffect(() => {
    if (token) fetchUserCart();
  }, [token, fetchUserCart]);

  // ---------------- Persist Cart ----------------
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // ---------------- Add to Cart ----------------
  const addToCart = useCallback(
    async (itemId) => {
      setCartItems((prev) => {
        const updated = { ...prev, [itemId]: (prev[itemId] || 0) + 1 };
        localStorage.setItem("cartItems", JSON.stringify(updated));
        return updated;
      });

      if (token) {
        try {
          await axios.post(
            `${url}/api/cart/add`,
            { itemId },
            { headers: { Authorization: `Bearer ${token}` } } // ✅ fixed
          );
        } catch (err) {
          console.error("Error adding to cart:", err);
        }
      }
    },
    [token, url]
  );

  // ---------------- Remove from Cart ----------------
  const removeFromCart = useCallback(
    async (itemId) => {
      setCartItems((prev) => {
        const qty = prev[itemId] || 0;
        let updated;
        if (qty <= 1) {
          const { [itemId]: _, ...rest } = prev;
          updated = rest;
        } else {
          updated = { ...prev, [itemId]: qty - 1 };
        }
        localStorage.setItem("cartItems", JSON.stringify(updated));
        return updated;
      });

      if (token) {
        try {
          await axios.post(
            `${url}/api/cart/remove`,
            { itemId },
            { headers: { Authorization: `Bearer ${token}` } } // ✅ fixed
          );
        } catch (err) {
          console.error("Error removing from cart:", err);
        }
      }
    },
    [token, url]
  );

  // ---------------- Clear Cart ----------------
  const clearCart = useCallback(async () => {
    setCartItems({});
    localStorage.removeItem("cartItems");

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/clear`,
          {},
          { headers: { Authorization: `Bearer ${token}` } } // ✅ fixed
        );
      } catch (err) {
        console.error("Error clearing backend cart:", err);
      }
    }
  }, [token, url]);

  // ---------------- Get Cart Count ----------------
  const getCartCount = useCallback(
    () => Object.values(cartItems).reduce((acc, qty) => acc + qty, 0),
    [cartItems]
  );

  // ---------------- Get Total Amount ----------------
  const getTotalCartAmount = useCallback(() => {
    return medicineList.reduce((total, item) => {
      if (cartItems[item._id]) {
        return total + item.price * cartItems[item._id];
      }
      return total;
    }, 0);
  }, [cartItems, medicineList]);

  // ---------------- Context Value ----------------
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
