import { Link } from "react-router-dom";

export default function SuccessPage() {
  return (
    <div className="page">
      <div className="card success-card">
        <div style={{ padding: "3rem 0", textAlign: "center" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "#d1fae5",
              color: "#059669",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              fontSize: "2.5rem",
              boxShadow: "0 10px 20px rgba(5, 150, 105, 0.15)",
            }}
          >
            ✓
          </div>
          <h1 className="title">Payment Success!</h1>
          <p className="subtitle">
            Thank you for your purchase. Your booking has been confirmed and a
            receipt was sent to your email.
          </p>
        </div>

        <div className="actions">
          <Link className="button primary" to="/">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
