import React from "react";
import image1 from "../assets/img/market.jpg"; // Replace with your actual image path
import { useAuth } from "../context/AuthContext";


const Hero = () => {
  // Inline styles
  const heroStyle = {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "400px", // Adjust height as needed
    width: "100%",
    margin: "68px 0 0 0",
    overflow: "hidden",
    color: "#fff", // Default text color for overlay
  };

  const mainTextStyle = {
    position: "absolute",
    top: "25%", // Position the "Welcome" text near the top of the image
    left: "50%",
    transform: "translateX(-50%)", // Center horizontally
    fontSize: "60px", // Much larger text size
    fontWeight: "900", // Very bold text
    textAlign: "center",
    maxWidth: "80%",
    letterSpacing: "2px", // Slightly increased letter spacing for impact
    lineHeight: "0.8", // Very small line spacing between lines
    fontFamily: "'Nunito', 'Varela Round', 'Arial Rounded MT Bold', sans-serif",
  };

  const overlayTextStyle = {
    position: "absolute",
    bottom: "90px", // Position the greeting text just above the buttons
    left: "50%",
    transform: "translateX(-50%)", // Center horizontally
    fontSize: "12px", // Slightly larger for better readability
    fontWeight: "normal",
    textAlign: "center",
    backgroundColor: "rgba(0, 123, 255, 0.7)", // Market-inspired greenish color with some transparency
    padding: "10px 20px",
    borderRadius: "10px",
    maxWidth: "80%",
  };

  const buttonContainerStyle = {
    position: "absolute", // Overlay the image
    bottom: "20px", // Adjust vertical position
    display: "flex", // Align buttons side by side
    gap: "10px", // Space between buttons
  };

  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    width: "170px",
    backgroundColor: "#FFF", // Default background color
    color: "#007BFF", // Default text color
    transition: "background-color 0.3s, color 0.3s", // Smooth transition
    borderRadius: "15px", // Rounded buttons
  };

  const hoverStyle = {
    backgroundColor: "#007BFF", // Hover background color
    color: "#FFF", // Hover text color
  };

  const { user } = useAuth();

  const getGreeting = () => {
    const currentHour = new Date().getHours(); // Get current hour in local time
    if (currentHour >= 0 && currentHour < 12) {
      return "Morning";
    } else if (currentHour >= 12 && currentHour < 17) {
      return "Afternoon";
    } else if (currentHour >= 17 && currentHour < 24) {
      return "Evening";
    }
  };

  const imageStyle = {
    flex: "1",
    height: "100%",
    objectFit: "cover", // Make images cover the area without stretching
  };

  return (
    <div style={heroStyle}>
      <img src={image1} alt="Image 1" style={imageStyle} />
      {/* Main "Welcome to Abatrades" Text */}
      <div style={mainTextStyle}>Welcome to Abatrades</div>
      {/* Welcome Message */}
      <div style={overlayTextStyle}>
        {user ? (
          <>
            Good {getGreeting()}, {user.name}.
          </>
        ) : (
          <>Good {getGreeting()}, Guest!</>
        )}
      </div>
     </div>
  );
};

export default Hero;
