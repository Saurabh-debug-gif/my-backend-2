import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

// Components 
import Navbar from "./components/Navbar/Navbar";
import Header from "./components/Header/Header";
import Home from "./pages/home/home";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Cart from "./pages/Cart/Cart";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#ff4081" },
    background: { default: "#f9f9f9" },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        {/* Navbar always visible */}
        <Navbar setShowLogin={setShowLogin} />

        {/* Show Header only on home page */}
        {location.pathname === "/" && <Header />}

        <Container sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/placeorder" element={<PlaceOrder />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </Container>

        <Footer />

        {/* Login Popup (modal-like overlay) */}
        {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      </div>
    </ThemeProvider>
  );
};

export default App;
