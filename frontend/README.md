# BK Frontend

Vite-powered frontend for the Burger King landing page.

## Source structure

- `index.html` contains the page frame and semantic sections, including the registration and sign-in forms.
- `src/main.js` coordinates application state and connects the feature modules.
- `src/components/` contains rendering and navigation behavior for reusable interface areas.
- `src/forms/` owns sign-in and registration validation, submission, and modal behavior.
- `src/services/` contains API access; `src/data/` contains fallback/demo data.
- `src/utils/` contains shared formatting helpers.
- `src/styles.css` provides the base styles; `src/styles/forms.css` and `src/styles/responsive.css` contain form and breakpoint-specific styles.

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
