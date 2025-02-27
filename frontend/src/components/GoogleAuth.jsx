// GoogleAuthButton.js
import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import axiosInstance from "./axiosInstance";

function GoogleAuth() {
  const handleGoogleLogin = async (credentialResponse) => {
    const getCsrfToken = () => {
      const name = "csrftoken";
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      console.log(parts.pop().split(";").shift());
      if (parts.length === 2) return parts.pop().split(";").shift();
    };
    try {
      const response = await axios.post(
        // "http://127.0.0.1:8000/api/api/social/login/",
        "http://127.0.0.1:8000/api/test/",
        {
          access_token: credentialResponse.credential,
          headers: {
            "X-CSRFToken": getCsrfToken(),
          },
          withCredentials: true,
        }
      );
      console.log(response.data); // Handle login response, store tokens if needed
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <GoogleOAuthProvider clientId="199766904815-fppnog3lkofrudpd9jquqndg9a0rj18k.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => console.log("Login Failed")}
        render={(renderProps) => (
          <button onClick={renderProps.onClick} disabled={renderProps.disabled}>
            Login with Google
          </button>
        )}
      />
    </GoogleOAuthProvider>
  );
}

export default GoogleAuth;
