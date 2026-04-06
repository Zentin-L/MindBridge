# MindBridge

MindBridge is a mental health first-aid web app with a React frontend and an Express backend.
It provides supportive, non-diagnostic AI responses, stress-level estimation, mood history tracking, and crisis-aware escalation guidance.

## Tech Stack

- Frontend: React 18, Vite, Tailwind CSS, Framer Motion, Axios
- Backend: Node.js, Express, Anthropic SDK, express-rate-limit, dotenv, cors
- Storage: Browser localStorage (for mood history)

## Project Structure

```text
mindbridge/
	backend/
		middleware/rateLimit.js
		routes/analyze.js
		server.js
		package.json
	frontend/
		src/
			components/
			hooks/useAnalysis.js
			utils/storage.js
			App.jsx
			main.jsx
			index.css
		package.json
	SETUP.md
	README.md
```

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+
- Anthropic API key

## Quick Start

1. Install backend dependencies:

```powershell
cd backend
npm install
```

2. Install frontend dependencies:

```powershell
cd ..\frontend
npm install
```

3. Create backend environment file at `backend/.env`:

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
PORT=3001
NODE_ENV=development
```

4. Run backend:

```powershell
cd ..\backend
npm run dev
```

5. Run frontend in a second terminal:

```powershell
cd ..\frontend
npm run dev
```

6. Open the app at `http://localhost:5173`.

## Environment Variables

Backend (`backend/.env`):

- `ANTHROPIC_API_KEY` (required for live AI responses)
- `PORT` (optional, default `3001`)
- `NODE_ENV` (`development` or `production`)

Frontend:

- `VITE_API_URL` (optional, defaults to `http://localhost:3001`)

## API Endpoints

- `GET /api/health` - health check
- `GET /api/debug` - route debug info
- `POST /api/analyze` - AI analysis endpoint

Example request:

```json
{
	"message": "I feel overwhelmed and cannot focus.",
	"history": [
		{ "role": "user", "content": "Work has been intense this week." }
	]
}
```

Example response shape:

```json
{
	"emotional_state": "overwhelmed",
	"stress_level": "High",
	"confidence": 78,
	"explanation": "...",
	"suggestions": ["...", "...", "..."],
	"urgency_flag": false,
	"affirmation": "..."
}
```

## Behavior Notes

- The backend skips rate limiting in development, but applies a 20 requests / 15 minutes limit in production.
- If your requested backend port is in use, the server retries with the next port automatically.
- If `ANTHROPIC_API_KEY` is missing or the Anthropic API is unavailable, the backend returns a structured fallback response.
- The frontend also provides a client-side fallback response when API requests fail.

## Scripts

Backend (`backend/package.json`):

- `npm run dev` - start server with nodemon
- `npm start` - start server with node

Frontend (`frontend/package.json`):

- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview production build

## Safety and Scope

MindBridge is intended as supportive first-aid guidance and is not a medical device.
It does not diagnose conditions or replace professional care.

If someone is in immediate danger, contact local emergency services right away.

## Troubleshooting

- Frontend cannot reach backend:
	- Verify backend is running and check `VITE_API_URL`.
	- Check CORS origin list in `backend/server.js`.
- Frequent `Too many analysis requests`:
	- Expected in production due to API rate limiting.
- API key issues:
	- Confirm `backend/.env` exists and restart backend after changes.

## License

MIT
