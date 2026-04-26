import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const CLIENT_ID = "199766904815-fppnog3lkofrudpd9jquqndg9a0rj18k.apps.googleusercontent.com";
const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Props:
 *  userType  — "buyer" | "seller"  (passed for new sign-ups)
 *  onSuccess — callback({ user, access_token }) after successful login/signup
 *  onError   — optional error callback(message)
 */
function GoogleAuth({ userType = "buyer", onSuccess, onError }) {
  const handleCredential = async (credentialResponse) => {
    try {
      const { data } = await axios.post(
        `${BASE}/api/google-login/`,
        {
          credential: credentialResponse.credential,
          user_type:  userType,
        },
        { withCredentials: true }
      );

      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }

      if (onSuccess) onSuccess(data);
    } catch (err) {
      const data = err.response?.data;
      const msg = data?.error === 'no_account'
        ? 'no_account'
        : (data?.error || "Google sign-in failed. Please try again.");
      if (onError) onError(msg);
    }
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div style={{ width: "100%" }}>
        <GoogleLogin
          onSuccess={handleCredential}
          onError={() => onError?.("Google sign-in was cancelled or failed.")}
          width="100%"
          text="continue_with"
          shape="rectangular"
          theme="outline"
          size="large"
        />
      </div>
    </GoogleOAuthProvider>
  );
}

export default GoogleAuth;
