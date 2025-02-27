import React from "react";

const SellerFaq = () => {
  return (
    <div
      className="container"
      style={{
        padding: "20px",
        backgroundColor: "#e6f0ff",
      }}
    >
      <div
        className="text-center"
        style={{
          marginBottom: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h3 style={{ fontWeight: "bold" }}>Frequently Asked Questions</h3>
      </div>

      <div
        className="faq-item"
        style={{
          marginBottom: "20px",
          borderBottom: "1px solid #ccc",
          paddingBottom: "10px",
        }}
      >
        <strong>What fees are involved?</strong>
        <p>
          We offer competitive commission rates per sale. Learn more about our
          pricing [here].
        </p>
      </div>

      <div
        className="faq-item"
        style={{
          marginBottom: "20px",
          borderBottom: "1px solid #ccc",
          paddingBottom: "10px",
        }}
      >
        <strong>Is Abatrades limited to Nigeria?</strong>
        <p>
          Yes, Abatrades currently operates exclusively in Nigeria, making it
          easy to cater to local customers.
        </p>
      </div>

      <div
        className="faq-item"
        style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px" }}
      >
        <strong>How do I receive payments?</strong>
        <p>
          Payments are securely deposited to your Nigerian bank account on a
          schedule that works for you.
        </p>
      </div>

      <div
        className="cta-section"
        style={{ textAlign: "center", marginTop: "40px" }}
      >
        <h2 style={{ fontWeight: "bold", marginBottom: "10px" }}>
          Start Selling on Abatrades
        </h2>
        <button
          style={{
            backgroundColor: "#3b7bf8",
            color: "white",
            borderRadius: "8px",
            border: "none",
            padding: "10px 20px",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          SIGN UP
        </button>
      </div>
    </div>
  );
};

export default SellerFaq;
