import { Link } from "react-router-dom";

export default function FailedPage() {
  return (
    <div className="page">
      <div className="card failed-card">
        <div style={{ padding: "3rem 0", textAlign: "center" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "#fee2e2",
              color: "#dc2626",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              fontSize: "2.5rem",
              boxShadow: "0 10px 20px rgba(220, 38, 38, 0.15)",
            }}
          >
            ✕
          </div>
          <h1 className="title">Payment Failed</h1>
          <p className="subtitle">
            Unfortunately, your transaction could not be processed. Please check
            your payment details and try again.
          </p>
        </div>

        <div className="actions">
          <Link
            className="button primary"
            to="/"
            style={{
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            }}
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}
