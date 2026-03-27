# MindBridge — Mental Health First-Aid AI

A compassionate, production-ready web application that provides supportive first-aid responses to users sharing their mental health concerns. Built with React, Node.js, and Claude AI.

## 📌 Latest Update

- Improved README onboarding with clearer environment setup steps.
- Added command references for both frontend and backend scripts.
- Included quick troubleshooting tips for common local setup issues.

## ✨ Features

- 🧠 **Empathetic AI Responses** — Uses Claude Sonnet to provide warm, supportive first-aid guidance
- 📊 **Stress Level Gauge** — Beautiful animated gauge showing your current stress level
- 💭 **Mood History** — 7-day timeline of mood entries stored locally
- 🌤️ **Daily Check-In** — Quick button to log your daily mood
- 🚀 **Actionable Suggestions** — AI provides specific, practical coping strategies
- 🚨 **Emergency Escalation** — Detects crisis indicators and displays helpline resources
- 🎨 **Calm, Accessible Design** — Warm color palette (sage, dusk, rose) with glassmorphism UI
- 📱 **Responsive** — Works beautifully on desktop and mobile

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Axios** for API calls
- **Google Fonts**: DM Serif Display + DM Sans

### Backend
- **Node.js + Express**
- **Anthropic SDK** (@anthropic-ai/sdk)
- **CORS**, **dotenv**, **express-rate-limit**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com))

### 1. Clone & Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd mindbridge

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ..
```

### 2. Configure Environment
```bash
# Copy example env file
cp .env.example backend/.env

# Edit backend/.env and add your API key
# ANTHROPIC_API_KEY=sk-ant-...
```

Windows PowerShell alternative:
```powershell
# If .env.example exists at repo root
Copy-Item .env.example backend/.env

# If .env.example is missing, create backend/.env manually
"ANTHROPIC_API_KEY=sk-ant-..." | Out-File -Encoding utf8 backend/.env
```

### 3. Run Development Servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server running on http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App running on http://localhost:5173
```

### 4. Open in Browser
Visit `http://localhost:5173`

## 📁 Project Structure

```
mindbridge/
├── backend/
│   ├── routes/analyze.js          # AI analysis endpoint
│   ├── middleware/rateLimit.js    # Rate limiting
│   ├── server.js                  # Express setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── hooks/useAnalysis.js   # API integration hook
│   │   ├── utils/storage.js       # localStorage utilities
│   │   ├── App.jsx                # Main layout
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Global styles
│   ├── public/index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🎨 Design System

### Color Palette
- **Cream**: `#f7f3ee` — Background
- **Sage**: `#7a9e7e` — Primary (calm, growth)
- **Dusk**: `#6b7fa3` — Secondary (thoughtful)
- **Rose**: `#c9837a` — Accent (warmth, alert)
- **Amber**: `#d4935a` — Warning (medium stress)
- **Ink**: `#2c3030` — Text

### Typography
- **Headings**: DM Serif Display (elegant, trustworthy)
- **Body**: DM Sans (readable, modern)

### Components
All major components feature:
- ✓ Glassmorphism (backdrop blur + semi-transparent)
- ✓ Soft, diffused shadows
- ✓ Rounded corners (16–24px)
- ✓ Smooth animations (Framer Motion)
- ✓ Accessibility-first design

## 🔧 API Endpoints

### `POST /api/analyze`
Analyzes user message and provides mental health first-aid response.

**Request:**
```json
{
  "message": "I feel overwhelmed with work",
  "history": []
}
```

**Response:**
```json
{
  "emotional_state": "overwhelmed",
  "stress_level": "High",
  "confidence": 85,
  "explanation": "It sounds like work demands are weighing heavily on you right now. Many people experience this kind of pressure, and it's important to acknowledge what you're feeling.",
  "suggestions": [
    "Try the Pomodoro technique: 25 mins focused work, 5 mins break",
    "Set boundaries: choose one task to finish before context-switching",
    "Take a 10-minute walk to reset your mind"
  ],
  "urgency_flag": false,
  "affirmation": "You're managing more than you think—be kind to yourself."
}
```

### `GET /api/health`
Health check endpoint.

## 💾 localStorage

- **`mindbridge_mood_history`** — Array of mood entries (max 30)
- **`mindbridge_last_checkin`** — ISO timestamp of last daily check-in

## 🚨 Emergency Features

When urgency_flag is `true`, the app displays:
- Warm rose/amber gradient banner
- Pulsing border animation
- 3+ helpline resources:
  - India: iCall (9152987821), Vandrevala (1860-2662-345)
  - US: Crisis Text Line (Text HOME to 741741)
  - Global: Befrienders Worldwide link

## 🚀 Deployment

### Deploy Backend
Choose one:

**Option 1: Vercel (separate project)**
```bash
cd backend
vercel deploy
```

**Option 2: Railway/Render**
- Connect GitHub repo
- Set root to `backend/`
- Add env var: `ANTHROPIC_API_KEY`

### Deploy Frontend
```bash
cd frontend

# Build
npm run build

# Deploy to Vercel, Netlify, etc.
vercel deploy
# OR
netlify deploy --prod --dir=dist
```

**Important:** Update `VITE_API_URL` in frontend `.env` to point to deployed backend.

### Example Deployed URLs
```
Frontend: https://mindbridge.vercel.app
Backend: https://mindbridge-api.railway.app
Environment: VITE_API_URL=https://mindbridge-api.railway.app
```

## ⚠️ Disclaimer

**MindBridge is a mental health support tool only.** It does NOT:
- Diagnose any mental health condition
- Replace professional therapy or medication
- Provide medical advice
- Guarantee accuracy or suitability for all situations

If you are in crisis, experiencing suicidal thoughts, or feel unsafe, **please contact a licensed mental health professional or emergency service immediately.**

### Resources
- 🆘 **US**: National Suicide Prevention Lifeline — 988
- 🆘 **India**: AASRA — 9820466726
- 🌍 **Global**: [Befrienders International](https://www.befrienders.org/)

## 📝 System Prompt (Claude)

MindBridge uses this system prompt with Claude Sonnet:

```
You are MindBridge, a compassionate mental health first-aid support assistant.

STRICT RULES:
- You NEVER diagnose any mental health condition
- You NEVER make clinical or medical claims
- You always say things like "it sounds like", "you might be feeling", "many people experience this"
- You always encourage professional help for serious concerns
- You escalate urgency_flag to true ONLY if user mentions: self-harm, suicidal thoughts, wanting to hurt themselves/others, or expresses complete hopelessness

Respond ONLY with valid JSON...
```

## 🧪 Development

### Run Backend Tests
```bash
cd backend
npm test
```

### Build for Production
```bash
# Frontend
cd frontend
npm run build

# Check dist/ folder
ls -la dist/
```

### Run Production Server
```bash
cd frontend
npm run preview
# (serves built frontend on port 5173)
```

## Scripts Reference

### Backend (`backend/package.json`)
- `npm run dev` - Start API server with auto-reload for development
- `npm start` - Start API server in normal mode
- `npm test` - Run backend tests

### Frontend (`frontend/package.json`)
- `npm run dev` - Start Vite development server
- `npm run build` - Build production frontend to `frontend/dist`
- `npm run preview` - Preview the production build locally

## Troubleshooting

- `ANTHROPIC_API_KEY` missing or invalid:
  The backend will fail API calls to Claude. Verify `backend/.env` and restart the backend server.
- CORS or network errors in the browser:
  Ensure backend is running on `http://localhost:3001` and frontend on `http://localhost:5173`.
- Frontend cannot reach backend in production:
  Set `VITE_API_URL` in frontend env config to your deployed backend URL.
- Port already in use:
  Stop the conflicting process or run the app on another port via your dev server config.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🌿 Branch Workflow

- Default branch: `main`
- Typical publish flow:
  - `git add .`
  - `git commit -m "your message"`
  - `git push origin main`

## 📄 License

MIT License — feel free to use MindBridge in your projects.

## 🙏 Acknowledgments

- Built with ❤️ by the MindBridge team
- Powered by [Anthropic's Claude](https://www.anthropic.com)
- Design inspired by wellness and journaling apps
- Community feedback and support make this better every day

---

**Remember:** You matter. Reaching out is a sign of strength. 💙
