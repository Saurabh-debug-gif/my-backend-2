import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../components/Context/StoreContext";
import { assets } from "../../assets/assets";
import axios from "axios";
import Header from "../../components/Header/Header";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  // Fetch user's orders
  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        `${url}/api/orders/userorders`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setData(response.data.data);
        console.log("Fetched Orders:", response.data.data);
      } else {
        console.log("No orders found.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <Header />
      <h2>My Orders</h2>

      <div className="container">
        {data.length > 0 ? (
          data.map((order, index) => (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="Parcel Icon" />
              <p>
                {order.items.map((item, idx) =>
                  idx === order.items.length - 1
                    ? `${item.name} x${item.quantity}`
                    : `${item.name} x${item.quantity}, `
                )}
              </p>
              <p>₹{order.amount}.00</p>
              <p>Items: {order.items.length}</p>
              <p>
                <span>&#x25cf;</span> <b>{order.status}</b>
              </p>
              <button>Track Order</button>
            </div>
          ))
        ) : (
          <p className="no-orders">No orders found yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
