import { useState, type SyntheticEvent } from "react";

type ApiEnvelope<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

type Booking = {
  _id: string;
  name: string;
  email: string;
  amount: number;
  paymentStatus: "UNPAID" | "PAID";
  createdAt?: string;
  updatedAt?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function apiPost<TResponse>(
  path: string,
  body: unknown,
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const json = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    const message = json?.message ?? response.statusText ?? "Request failed";
    throw new Error(message);
  }

  return json as TResponse;
}

export default function CheckoutPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState<number>(20);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

  const onPay = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setBooking(null);

    try {
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();
      const normalizedAmount = Number(amount);

      if (!trimmedName) throw new Error("Name is required");
      if (!trimmedEmail) throw new Error("Email is required");
      if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
        throw new Error("Amount must be a positive number");
      }

      const bookingRes = await apiPost<ApiEnvelope<Booking>>("/booking", {
        name: trimmedName,
        email: trimmedEmail,
        amount: normalizedAmount,
      });

      setBooking(bookingRes.data);

      const paymentRes = await apiPost<ApiEnvelope<{ paymentUrl: string }>>(
        `/payment/${bookingRes.data._id}`,
        {},
      );

      if (!paymentRes.data?.paymentUrl) {
        throw new Error("Missing paymentUrl from server");
      }

      console.log(paymentRes);

      window.location.href = paymentRes.data.paymentUrl;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <div className="header">
          <div className="kicker">Secure Checkout</div>
          <h1 className="title">Confirm Booking</h1>
          <p className="subtitle">
            Enter your details below to proceed with the secure Stripe payment.
          </p>
        </div>

        <form className="form" onSubmit={onPay}>
          <div className="grid">
            <label className="field">
              <span className="label">Full Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                autoComplete="name"
                disabled={isLoading}
              />
            </label>

            <label className="field">
              <span className="label">Email Address</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                autoComplete="email"
                type="email"
                disabled={isLoading}
              />
            </label>

            <label className="field">
              <span className="label">Amount (USD)</span>
              <input
                type="number"
                min={1}
                step={1}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                disabled={isLoading}
              />
            </label>
          </div>

          <div className="actions">
            <button
              className="button primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Preparing..." : `Pay $${amount}.00`}
            </button>
          </div>
        </form>

        {error ? <div className="alert error">{error}</div> : null}

        {booking ? (
          <div className="alert info">
            <div className="row">
              <div className="meta">
                <div className="metaKey">ID</div>
                <div className="metaValue">
                  {booking._id.substring(0, 18)}...
                </div>
              </div>
              <div
                className={`pill ${booking.paymentStatus === "PAID" ? "ok" : "warn"}`}
              >
                {booking.paymentStatus}
              </div>
            </div>
          </div>
        ) : null}

        <div className="footer">
          <div className="footRow">
            <span className="footKey">Gateway</span>
            <span className="footValue">Stripe Test Mode</span>
          </div>
          <div className="footRow">
            <span className="footKey">API Host</span>
            <span className="footValue">{API_BASE_URL}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
