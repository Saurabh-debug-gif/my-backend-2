import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../components/Context/StoreContext";
import axios from "axios";
import "./Verify.css";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { url } = useContext(StoreContext);

  const orderId = searchParams.get("order_id");
  const [statusMessage, setStatusMessage] = useState(
    "Verifying payment, please wait..."
  );

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId) {
        setStatusMessage("Missing order details!");
        return;
      }

      try {
        const response = await axios.post(`${url}/api/orders/verify`, {
          orderId,
        });

        if (response.data.success) {
          const paymentStatus = response.data.paymentStatus?.toLowerCase();
          if (paymentStatus === "success") {
            setStatusMessage("✅ Payment Successful!");
            setTimeout(() => navigate("/myorders"), 2000);
          } else {
            setStatusMessage("❌ Payment Failed!");
            setTimeout(() => navigate("/"), 2000);
          }
        } else {
          setStatusMessage("Payment verification failed!");
          setTimeout(() => navigate("/"), 2000);
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatusMessage("Payment verification failed!");
        setTimeout(() => navigate("/"), 2000);
      }
    };

    verifyPayment();
  }, [orderId, url, navigate]);

  return (
    <div className="verify">
      <h1>{statusMessage}</h1>
    </div>
  );
};

export default Verify;
