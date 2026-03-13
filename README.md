# WeHealthify – Patient Outcome Tracker

A multi-tenant SaaS demo: multiple clinics use the same app to track patient outcomes with **strict data isolation** between tenants.

---

## How to set up this project

Follow these steps to run the app locally.

### Prerequisites

- **Node.js** 18 or higher  
- **MongoDB** – local installation or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string  

### 1. Clone and open the repo

```bash
git clone <repository-url>
cd wehealthify
```

### 2. Set up the backend

```bash
cd backend
```

- Copy the example env file and add your settings:

  ```bash
  cp .env.example .env
  ```

- Edit `.env` and set at least:
  - **`MONGODB_URI`** – your MongoDB connection string (e.g. `mongodb://localhost:27017/wehealthify` or an Atlas URI)
  - Optionally: `JWT_SECRET`, `PORT`, `CORS_ORIGIN` (see [Environment variables](#environment-variables) below)

- Install dependencies and start the server:

  ```bash
  npm install
  npm run dev
  ```

The API will be at **http://localhost:5000** (or the `PORT` you set). The **seed runs automatically on every backend start** (2 clinics, sample users and outcomes). To run the seed manually once: `npm run seed` from the `backend/` directory.

### 3. Set up the frontend

Open a **new terminal** and run:

```bash
cd frontend
```

- Copy the example env file:

  ```bash
  cp .env.example .env
  ```

- If your backend is **not** at `http://localhost:5000`, edit `.env` and set **`VITE_API_URL`** to your backend URL (e.g. `http://localhost:5001`).

- Install dependencies and start the dev server:

  ```bash
  npm install
  npm run dev
  ```

The app will be at **http://localhost:5173**.

### 4. Verify the setup

1. Open **http://localhost:5173** in your browser.
2. On the login page, use one of the **default credentials** (or click a row to fill the form).
3. Sign in, add an outcome, and confirm it appears in the list.
4. Sign out and sign in with a user from the **other** clinic; you should see only that clinic’s outcomes.

---

## Test credentials (2 clinics)

| Clinic | Username | Password |
|--------|----------|----------|
| **Sunrise Physical Therapy** | `sarah@sunrise` | `sunrise123` |
| | `mike@sunrise` | `sunrise123` |
| **Downtown Wellness Clinic** | `jane@downtown` | `downtown123` |
| | `david@downtown` | `downtown123` |

The login page also shows these; click a row to fill the form. Each clinic has its own outcomes.

---

## Environment variables

**Backend** (`.env` in `backend/`):

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string (e.g. `mongodb://localhost:27017/wehealthify` or Atlas URI) |
| `JWT_SECRET` | No | Secret for signing JWTs (default: dev placeholder) |
| `PORT` | No | Server port (default: 5000) |
| `CORS_ORIGIN` | No | Allowed frontend origin (default: http://localhost:5173) |

**Frontend** (`.env` in `frontend/`):

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Backend base URL (default: http://localhost:5000) |

---

## How to run the seed script

- **Automatic:** The seed runs on every backend start when you run `npm run dev` in `backend/`.
- **Manual:** From the `backend/` directory: `npm run seed`.

Seed data includes: 2 clinics, 4 users (2 per clinic), and 6 sample outcomes (3 per clinic).

---

## Multi-tenant architecture

**Approach: row-level tenancy** (shared database, tenant key on every record).

- **Tenant boundary:** `clinicId`. Every `User` and every `Outcome` has a `clinicId`. Isolation is enforced by **always** filtering on `clinicId`.
- **Enforcement:** Login returns a JWT with the user’s id. Protected endpoints resolve the user and use `req.user.clinicId`. **GET /api/outcomes** queries by `clinicId`; **POST /api/outcomes** sets `clinicId` from the token (client cannot override it).
- **Rationale:** Simple, auditable, and easy to extend. Other options (e.g. DB-per-tenant) add operational complexity; for this scope, row-level tenancy is a good fit.

---

## Project layout

```
wehealthify/
├── backend/
│   ├── src/
│   │   ├── config/         # Env-based config
│   │   ├── controllers/    # auth, outcomes
│   │   ├── db/             # MongoDB connection, seed
│   │   ├── middleware/     # auth (JWT), error handler
│   │   ├── models/         # Clinic, User, Outcome (Mongoose)
│   │   ├── routes/         # /api/auth, /api/outcomes
│   │   └── index.js        # Express app entry
│   └── scripts/
│       └── seed.js         # Standalone seed script
├── frontend/
│   └── src/
│       ├── api/            # API client
│       ├── context/        # AuthContext
│       ├── pages/          # Login, Dashboard
│       ├── App.jsx
│       └── main.jsx
└── README.md
```

---

## API summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Body: `{ username, password }`. Returns `{ token, user }`. |
| GET | `/api/outcomes` | Bearer | List outcomes for the current user’s clinic. |
| POST | `/api/outcomes` | Bearer | Create outcome. Body: `patientIdentifier`, `painScore` (1–10), `mobilityScore` (1–10), optional `dateRecorded` (ISO). `clinicId` is set server-side. |
# wehealthify-outcome-tracker
