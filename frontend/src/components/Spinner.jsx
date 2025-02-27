import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const Spinner = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div style={styles.spinnerContainer}>
      <ClipLoader loading={loading} size={50} color="#3498db" />
    </div>
  );
};

const styles = {
  spinnerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Full screen height
  },
};

export default Spinner;
