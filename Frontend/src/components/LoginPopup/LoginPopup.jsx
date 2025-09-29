import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../Context/StoreContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Sign Up");
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // Toggle Login/Sign Up
  const handleToggleState = () => {
    setCurrState(currState === "Sign Up" ? "Login" : "Sign Up");
    setData({ name: "", email: "", password: "" });
  };

  // Input change handler
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit
  const onLogin = async (event) => {
    event.preventDefault();

    const endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register";
    const body = currState === "Login" ? { email: data.email, password: data.password } : data;

    try {
      const response = await axios.post(`${url}${endpoint}`, body, {
        headers: { "Content-Type": "application/json" }
      });

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success(`${currState} successful!`);
        setShowLogin(false);
        navigate("/"); // optional: redirect after login
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Login/Register error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    toast.info("Logged out successfully.");
    navigate("/");
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="login-popup">
        <form onSubmit={onLogin} className="login-popup-container">
          <div className="login-popup-title">
            <h2>{currState}</h2>
            <img
              src={assets.cross_icon}
              alt="close"
              onClick={() => setShowLogin(false)}
            />
          </div>

          <div className="login-popup-inputs">
            {currState === "Sign Up" && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={data.name}
                onChange={onChangeHandler}
                required
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={data.email}
              onChange={onChangeHandler}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={data.password}
              onChange={onChangeHandler}
              required
            />
          </div>

          <button type="submit">
            {currState === "Sign Up" ? "Create Account" : "Login"}
          </button>

          {currState === "Sign Up" && (
            <div className="login-popup-condition">
              <input type="checkbox" required />
              <p>I agree to the terms & conditions</p>
            </div>
          )}

          <p>
            {currState === "Sign Up"
              ? "Already have an account? "
              : "Don't have an account? "}
            <span onClick={handleToggleState}>
              {currState === "Sign Up" ? "Login" : "Sign Up"}
            </span>
          </p>
        </form>
      </div>
    </>
  );
};

export default LoginPopup;
``
