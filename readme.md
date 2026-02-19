# Stripe Demo Payment (Frontend + Backend)

This workspace contains a minimal Stripe Checkout demo with a React frontend and an Express + MongoDB backend.

## Live Links

- Frontend: https://stripe-payment-nine-sigma.vercel.app
- Backend: https://stripe-payment-implementation.onrender.com

## Project Structure

```
stripe-backend/
	src/
		app.ts
		server.ts
		app/
			config/
				env.ts
			module/
				booking/
				payment/

stripe-frontend/
	src/
		App.tsx
		components/
			CheckoutPage.tsx
			SuccessPage.tsx
			FailedPage.tsx
```

## Prerequisites

- Node.js 18+
- MongoDB connection string
- Stripe account (test mode)
- Stripe CLI (optional, for webhooks)

## Backend Setup

From `stripe-backend/`:

1. Install dependencies

```
npm install
```

2. Create a `.env` file with these values:

```
PORT=5000
DB_URL=mongodb+srv://<user>:<pass>@<cluster>/<db>
NODE_ENV=development

STRIPE_SECRET_KEY=sk_test_...
WEBHOOK_SECRET_KEY=whsec_...

SUCCESS_URL=http://localhost:5173/success
CANCEL_URL=http://localhost:5173/failed
```

Notes:

- In development, the backend will default `SUCCESS_URL` and `CANCEL_URL` if they are missing.
- Use the Stripe CLI to get `WEBHOOK_SECRET_KEY` when testing webhooks.

3. Start the server

```
npm run dev
```

Backend runs on `http://localhost:5000`.

### Backend API

- `POST /api/v1/booking`
  - Body: `{ name, email, amount }`
  - Creates a booking in MongoDB.

- `POST /api/v1/payment/:bookingId`
  - Creates a Stripe Checkout session
  - Response: `{ paymentUrl }`

- `POST /webhook`
  - Stripe webhook endpoint

### Stripe Webhook (Optional)

Forward Stripe events to your local server:

```
stripe listen --forward-to localhost:5000/webhook
```

Copy the printed signing secret into `WEBHOOK_SECRET_KEY`.

## Frontend Setup

From `stripe-frontend/`:

1. Install dependencies

```
npm install
```

2. Configure API base (optional)

The frontend reads `VITE_API_BASE_URL` from `.env.local`:

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

3. Start the app

```
npm run dev
```

Frontend runs on `http://localhost:5173`.

### Frontend Routes

- `/` (Checkout form)
- `/success`
- `/failed`

## Demo Flow

1. Fill out the form on `/`.
2. The frontend creates a booking, then requests a Stripe Checkout session.
3. Stripe redirects to:
   - `/success` on successful payment
   - `/failed` on cancel or failure

### Test Card

Use Stripe test card:

```
4242 4242 4242 4242
```

Any future expiry date and any CVC work in test mode.

## Notes

- CORS is configured for `http://localhost:5173` by default.
- If you change the frontend port, update the backend CORS origin and `SUCCESS_URL` / `CANCEL_URL`.
