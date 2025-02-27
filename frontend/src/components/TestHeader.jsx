import React from "react";
import { useAuth } from "../context/AuthContext"; // Correct path

const TestHeader = () => {
  const { user, login, logout, setUser } = useAuth(); // Destructure correctly

  //   const handleLogin = () => {
  //     login({ name: "John Doe" });
  //   };

  //   const handleLogout = () => {
  //     logout();
  //   };

  return (
    <div>
      <h1>Welcome {user ? user.name : "Guest"}</h1>
      {/* <button onClick={user ? handleLogout : handleLogin}>
        {user ? "Logout" : "Login"}
      </button> */}
    </div>
  );
};

export default TestHeader;
