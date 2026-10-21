# Burger King Fullstack — Separated Frontend & Backend

This package splits the project into two apps:

- `frontend/` → Vite frontend
- `backend/` → Express + SQLite API

## Run locally in 2 terminals

### Terminal 1 — backend

```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

Backend runs on `http://localhost:3001`.

### Terminal 2 — frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Test flow

1. Open `http://localhost:5173`
2. Browse menu, deals, and stores loaded from the backend
3. Create an account in Rewards or sign in with a test user
4. Add items to cart and checkout

## Included test login

- Email: `jake@example.com`
- Password: `Customer123!`

## Go live

### Frontend
Deploy `frontend/` to Vercel or Netlify.
Set:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

### Backend
Deploy `backend/` to a Node host that supports a persistent disk for SQLite.
Set:

```env
PORT=3001
JWT_SECRET=change_this_to_a_long_random_secret
FRONTEND_URLS=http://localhost:5173,https://your-frontend-domain.vercel.app
DB_PATH=./data/bk.db
ADMIN_EMAIL=admin@bk.com
```

If you redeploy to a fresh environment, run the seed command once after install.
