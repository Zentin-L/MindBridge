# MindBridge

MindBridge is a mental health first-aid web app with a React frontend and an Express backend powered by Anthropic.

## What It Does

- Provides empathetic, non-diagnostic AI support responses
- Shows actionable suggestions and stress-oriented guidance
- Stores lightweight mood/check-in history locally in the browser
- Includes basic backend safeguards like rate limiting

## Tech Stack

- Frontend: React 18, Vite, Tailwind CSS, Framer Motion
- Backend: Node.js, Express, Anthropic SDK

## Project Structure

```text
mindbridge/
	backend/
		middleware/
		routes/
		server.js
		package.json
	frontend/
		src/
		public/
		package.json
	README.md
	SETUP.md
```

## Prerequisites

- Node.js 18+
- npm 9+
- Anthropic API key

## Environment Variables

Create `backend/.env`:

```env
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
NODE_ENV=development
```

Optional frontend variable:

```env
VITE_API_URL=http://localhost:3001
```

If `VITE_API_URL` is not set, the frontend uses its default API URL.

## Install

```powershell
cd backend
npm install

cd ../frontend
npm install
```

## Run Locally

Backend:

```powershell
cd backend
npm run dev
```

Frontend:

```powershell
cd frontend
npm run dev
```

Open http://localhost:5173

## Available Scripts

Backend (`backend/package.json`):

- `npm run dev` - Start backend with nodemon
- `npm start` - Start backend with node

Frontend (`frontend/package.json`):

- `npm run dev` - Start Vite dev server
- `npm run build` - Build production assets
- `npm run preview` - Preview production build locally

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/debug` - Basic route debug info
- `POST /api/analyze` - Analyze user input and return support response

## Notes

- The backend enables CORS for local frontend origins (`localhost:5173`, `localhost:3000`, `127.0.0.1:5173`).
- If the configured backend port is already in use, startup automatically retries on the next port (up to 10 tries).
- Rate limiting is applied to `/api/analyze`.

## Troubleshooting

- If frontend cannot reach backend, verify `VITE_API_URL` and backend port in logs.
- If Anthropic requests fail, verify `ANTHROPIC_API_KEY` in `backend/.env`.
- If you see an address-in-use error, check backend startup logs for the fallback port used.
