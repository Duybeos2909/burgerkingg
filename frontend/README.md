# BK Frontend

Vite-powered frontend for the Burger King landing page.

## Local setup

```bash
npm install
copy .env.example .env
npm run dev
```

Open `http://localhost:5173`.

## Environment

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## Build for production

```bash
npm run build
npm run preview
```

The production-ready files are generated in `dist/`.
