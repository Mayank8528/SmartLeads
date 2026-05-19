# ServiceHive — Lead Management

> Simple lead management app with an Express + TypeScript backend and a Vite + React frontend.

## Features
- JWT authentication
- CRUD leads API
- React frontend with Vite and Tailwind

## Requirements
- Node.js 18+ / 20 recommended
- npm
- MongoDB (local) or Docker

## Quick start — Local (recommended for development)

1. Start the backend (in one terminal):

```powershell
cd backend
npm install
npm run dev
```

2. Start the frontend (in a separate terminal):

```powershell
cd frontend
npm install
npm run dev -- --host
```

Frontend will be available at http://localhost:5173 and backend at http://localhost:5000.

## Environment
Copy `backend/.env.example` to `backend/.env` and update values as needed. Example keys:

- `NODE_ENV` — development/production
- `PORT` — backend port (5000)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — replace with a strong secret

## Quick start — Docker

Requires Docker & Docker Compose. From project root:

```powershell
docker-compose up --build
```

Services:
- `mongodb` — MongoDB
- `backend` — Express API (5000)
- `frontend` — Vite dev server (5173)

## Useful endpoints
- GET `/` — root (may return 404 depending on routes)
- POST `/api/auth/register` — register user
- POST `/api/auth/login` — login and receive JWT
- GET `/api/leads` — protected leads list (requires `Authorization: Bearer <token>`)

## Verifying the API
You can test the backend with PowerShell:

```powershell
# list leads (requires auth)
Invoke-WebRequest -UseBasicParsing http://localhost:5000/api/leads

# or check root
Invoke-WebRequest -UseBasicParsing http://localhost:5000/
```

## Contributing
- Create issues or PRs. Keep secrets out of commits — use `.env` and `backend/.env.example`.

## License
MIT
# SmartLeads