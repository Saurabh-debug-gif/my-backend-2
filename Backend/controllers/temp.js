import axios from "axios";
import orderModel from "../models/orderModel.js";

// ------------------- PLACE ORDER -------------------
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { items, amount, address } = req.body;

    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user" });

    const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";

    const CASHFREE_BASE_URL = "https://sandbox.cashfree.com/pg";
    const CASHFREE_APP_ID = process.env.CASHFREE_SANDBOX_APP_ID;
    const CASHFREE_SECRET_KEY = process.env.CASHFREE_SANDBOX_SECRET_KEY;

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: "Cashfree credentials missing",
      });
    }

    // Save order as pending first
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      status: "PENDING",
      payment: false,
    });
    await newOrder.save();

    // Create Cashfree order
    const cfOrder = await axios.post(
      `${CASHFREE_BASE_URL}/orders`,
      {
        order_id: newOrder._id.toString(),
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: userId.toString(),
          customer_name: `${address.firstName} ${address.lastName}`,
          customer_email: address.email,
          customer_phone: address.phone,
        },
        order_meta: {
          return_url: `${frontend_url}/verify?order_id=${newOrder._id}`,
        },
      },
      {
        headers: {
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01",
          "Content-Type": "application/json",
        },
      }
    );

    const paymentSessionId = cfOrder.data?.payment_session_id;
    if (!paymentSessionId) {
      return res.status(500).json({
        success: false,
        message: "Failed to create Cashfree payment session",
        error: cfOrder.data,
      });
    }

    const paymentUrl = `https://sandbox.cashfree.com/pgapp/v3/#/payment/${paymentSessionId}`;

    res.json({
      success: true,
      paymentSessionId,
      paymentUrl,
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("❌ Order placement failed:", error.message);
    if (error.response) console.error(error.response.data);

    res.status(500).json({
      success: false,
      message: "Order failed",
      error: error.response?.data || error.message,
    });
  }
};

// ------------------- VERIFY ORDER -------------------
export const verifyOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing orderId" });
    }

    const order = await orderModel.findById(orderId);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    const CASHFREE_BASE_URL = "https://sandbox.cashfree.com/pg";
    const CASHFREE_APP_ID = process.env.CASHFREE_SANDBOX_APP_ID;
    const CASHFREE_SECRET_KEY = process.env.CASHFREE_SANDBOX_SECRET_KEY;

    // Verify payment status from Cashfree
    const verifyResponse = await axios.get(
      `${CASHFREE_BASE_URL}/orders/${orderId}/payments`,
      {
        headers: {
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01",
          "Content-Type": "application/json",
        },
      }
    );

    const paymentData = verifyResponse.data?.[0];
    if (!paymentData)
      return res
        .status(400)
        .json({ success: false, message: "No payment data found" });

    const paymentStatus = paymentData.payment_status?.toLowerCase();
    let newStatus = "FAILED";
    let paymentFlag = false;

    if (paymentStatus === "success") {
      newStatus = "PAID";
      paymentFlag = true;
    }

    await orderModel.findByIdAndUpdate(orderId, {
      status: newStatus,
      payment: paymentFlag,
    });

    return res.json({
      success: true,
      message: `Payment status updated to ${newStatus}`,
      paymentStatus,
    });
  } catch (error) {
    console.error("verifyOrder error:", error.response?.data || error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// ------------------- USER ORDERS -------------------
export const userOrders = async (req, res) => {
  try {
    const userId = req.user?._id; // always from token, safer than req.body

    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user" });

    const orders = await orderModel
      .find({ userId })
      .sort({ createdAt: -1 }); // newest first

    return res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("userOrders error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
    });
  }
};
