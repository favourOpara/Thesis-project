import React from "react";

const SellerBenefits = () => {
  return (
    <div
      className="container"
      style={{ padding: "40px 20px", backgroundColor: "#e6f0ff" }}
    >
      {/* Header */}
      <h2
        style={{
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "40px",
          fontSize: "32px",
        }}
      >
        Why Sell on Abatrades?
      </h2>

      {/* Content Sections */}
      <div
        style={{
          //   display: "flex",
          //   flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: "40px",
          gap: "20px",
          //   flexWrap: "wrap",
        }}
      >
        {/* Benefits Section */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#d4dde9",
            padding: "20px",
            borderRadius: "8px",
            order: 2,
          }}
        >
          <ul style={{ fontSize: "16px", lineHeight: "1.8" }}>
            <li>
              Connect with thousands of Nigerian customers actively searching
              for products like yours.
            </li>
            <li>
              Our competitive rates keep costs low, so you can grow with every
              sale.
            </li>
            <li>
              Our platform simplifies inventory tracking, order management, and
              customer service.
            </li>
            <li>
              Our team offers support with everything from marketing to
              shipping, helping you grow your business.
            </li>
          </ul>
        </div>
      </div>
      {/* How It Works Section */}
      <div style={{ flex: 1, padding: "20px", order: 1 }}>
        <h3 style={{ fontWeight: "bold", fontSize: "24px" }}>HOW IT WORKS</h3>
        <ol style={{ fontSize: "16px", lineHeight: "1.6" }}>
          <li>
            <strong>Create Your Seller Account:</strong> Register with your
            business details and verify your identity.
          </li>
          <li>
            <strong>List Your Products:</strong> Upload your product
            descriptions, pricing, and images for buyers to view.
          </li>
          <li>
            <strong>Manage Orders:</strong> Process and fulfill orders, ensuring
            timely delivery for customer satisfaction.
          </li>
          <li>
            <strong>Receive Your Payments:</strong> Get paid securely and
            directly to your Nigerian bank account.
          </li>
        </ol>
      </div>

      {/* Seller Tools & Resources Section */}
      <h2
        style={{
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "28px",
        }}
      >
        Seller Tools & Resources
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h4 style={{ fontWeight: "bold", marginBottom: "10px" }}>
            Analytics Dashboard
          </h4>
          <p>Track sales, product views, and revenue trends.</p>
        </div>
        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h4 style={{ fontWeight: "bold", marginBottom: "10px" }}>
            Learning Center
          </h4>
          <p>
            Access articles and tips tailored to your success in Nigeria’s
            online market space.
          </p>
        </div>
        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h4 style={{ fontWeight: "bold", marginBottom: "10px" }}>
            Marketing Opportunities
          </h4>
          <p>
            Boost visibility with ads, promotions, and featured placements on
            Abatrades.
          </p>
        </div>
        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h4 style={{ fontWeight: "bold", marginBottom: "10px" }}>
            Customer Reviews
          </h4>
          <p>Use feedback to continually improve your offerings.</p>
        </div>
      </div>
    </div>
  );
};

// Ensure this is included at the bottom of your file
export default SellerBenefits;
