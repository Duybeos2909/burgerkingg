# BK Backend

Node.js + Express + SQLite backend for the Burger King website.

## Setup

1. Install dependencies
   npm install

2. Create environment file
   cp .env.example .env
   # Edit .env and set JWT_SECRET to a random long string

3. Seed the database
   npm run seed

4. Start development server
   npm run dev

Server runs on http://localhost:3001

## API Base URL
http://localhost:3001/api

## Test the API
curl http://localhost:3001/health
curl http://localhost:3001/api/menu
curl http://localhost:3001/api/deals
curl http://localhost:3001/api/stores

## Register a user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Jake","email":"jake@test.com","password":"Test123!","dob":"1995-01-01","postcode":"NY 10001"}'

## Place an order
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items":[{"menu_item_id":1,"name":"Whopper","price":5.49,"qty":1}],"order_type":"pickup","store_id":1,"guest_email":"guest@test.com"}'


## Frontend CORS
Set one or more allowed frontend origins in `.env`:

```env
FRONTEND_URLS=http://localhost:5173,https://your-frontend-domain.vercel.app
```

## Production note
This backend uses SQLite. For production hosting, use a platform with persistent disk/volume support or move to a managed database before scaling.
