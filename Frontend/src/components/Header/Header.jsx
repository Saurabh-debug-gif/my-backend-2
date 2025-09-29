import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { assets } from "../../assets/assets";

const Header = () => {
  return (
    <Box
      id="home"
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 400, md: 600 }, // adjust height
        overflow: "hidden",
      }}
    >
      {/* Hero Image */}
      <Box
        component="img"
        src={assets.header_img}
        alt="Healthcare Products"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.65)", // darken image for text overlay
        }}
      />

      {/* Overlay Text */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: { xs: "50%", md: "10%" },
          transform: { xs: "translate(-50%, -50%)", md: "translate(0, -50%)" },
          color: "#fff",
          maxWidth: { xs: "90%", md: "500px" },
          textAlign: { xs: "center", md: "left" },
        }}
      >
        {/* Logo */}
        <Box mb={2}>
          <img
            src={assets.logo}
            alt="Clitoria Life Science Logo"
            style={{ height: 100 }}
          />
        </Box>

        {/* Welcome Text */}
        <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
          Welcome to Clitoria Life Science
        </Typography>

        {/* Tagline */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Genuine Medicines. Trusted Healthcare. Always.
        </Typography>

        {/* Description */}
        <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
          Our healthcare platform is built on trust and transparency. All medicines and healthcare
          products are sourced from licensed distributors and certified manufacturers. Your health
          is our priority, and we are committed to delivering only genuine, reliable, and approved
          medical supplies.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ borderRadius: "30px", px: 4 }}
        >
          Shop Now
        </Button>
      </Box>
    </Box>
  );
};

export default Header;

