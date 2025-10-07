import React, { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import SearchIcon from "@mui/icons-material/Search";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../components/Context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const [activeSection, setActiveSection] = useState("home");
  const { getCartCount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  // Profile menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleProfileClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Logout
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    handleMenuClose();
    navigate("/");
  };

  // Smooth scroll to section
  const handleScroll = (e, id, sectionName) => {
    e.preventDefault();
    setActiveSection(sectionName);
    const top = id === "#home" ? 0 : document.querySelector(id)?.offsetTop || 0;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "white", color: "black", boxShadow: 2 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link
            to="/"
            style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}
          >
            <img src={assets.logo} alt="Logo" style={{ height: 40, marginRight: 10 }} />
            <Typography variant="h6" fontWeight="bold">
              Clitoria Life Science
            </Typography>
          </Link>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", gap: 3 }}>
          {[
            { name: "home", label: "Home", id: "#home" },
            { name: "type", label: "Type", id: "#explore-type" },
            { name: "mobile-app", label: "Mobile App", id: "#app-download" },
            { name: "contact-us", label: "Contact Us", id: "#footer" },
          ].map((link) => (
            <Button
              key={link.name}
              onClick={(e) => handleScroll(e, link.id, link.name)}
              sx={{
                color: activeSection === link.name ? "primary.main" : "text.primary",
                fontWeight: activeSection === link.name ? "bold" : "normal",
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>

        {/* Right Side Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton>
            <SearchIcon />
          </IconButton>

          {/* Cart */}
          <Link to="/cart">
            <IconButton>
              <Badge badgeContent={parseInt(getCartCount() || 0, 10)} color="secondary">
                <ShoppingBasketIcon />
              </Badge>
            </IconButton>
          </Link>

          {/* Sign In / Profile Menu */}
          {!token ? (
            <Button variant="contained" color="primary" onClick={() => setShowLogin(true)}>
              Sign In
            </Button>
          ) : (
            <>
              <IconButton onClick={handleProfileClick} size="small" sx={{ ml: 2 }}>
                <Avatar src={assets.profile_icon} alt="Profile" />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
              >
                <MenuItem component={Link} to="/myorders" onClick={handleMenuClose}>
                  <img src={assets.bag_icon} alt="orders" style={{ width: 20, marginRight: 8 }} />
                  Orders
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <img src={assets.logout_icon} alt="Logout" style={{ width: 20, marginRight: 8 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
