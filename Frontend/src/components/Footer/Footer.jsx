import React from "react";
import { Box, Typography, Link, IconButton, Grid } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <Box
      id="footer"
      sx={{
        backgroundColor: "#f5f5f5",
        color: "text.primary",
        mt: 5,
        pt: 6,
        pb: 3,
        px: { xs: 3, md: 8 },
      }}
    >
      <Grid container spacing={5}>
        {/* Left Section */}
        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center" mb={2}>
            <img
              src={assets.logo}
              alt="Clitoria Life Science Logo"
              style={{ height: 50, marginRight: 10 }}
            />
            <Typography variant="h6" fontWeight="bold">
              Clitoria Life Science
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            Our healthcare platform is built on trust and transparency. All medicines and healthcare
            products are sourced from licensed distributors and certified manufacturers. Your health
            is our priority, and we are committed to delivering only genuine, reliable, and approved
            medical supplies.
          </Typography>

          <Box display="flex" gap={1}>
            <IconButton
              component="a"
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              aria-label="Facebook"
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              component="a"
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              aria-label="Twitter"
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              component="a"
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </IconButton>
          </Box>
        </Grid>

        {/* Center Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Company
          </Typography>
          <Box display="flex" flexDirection="column" gap={1}>
            <Link href="#home" underline="hover" color="inherit">
              Home
            </Link>
            <Link href="#about" underline="hover" color="inherit">
              About Us
            </Link>
            <Link href="#delivery" underline="hover" color="inherit">
              Delivery
            </Link>
            <Link href="#privacy" underline="hover" color="inherit">
              Privacy Policy
            </Link>
          </Box>
        </Grid>
      </Grid>

      {/* Bottom Text */}
      <Typography
        variant="caption"
        display="block"
        textAlign="center"
        sx={{ mt: 4, color: "text.secondary" }}
      >
        © {new Date().getFullYear()} Clitoria Life Science Pvt. Ltd. | Authorized Medical Distributor License Holder
      </Typography>
    </Box>
  );
};

export default Footer;
