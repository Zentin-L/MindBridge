# MindBridge Quick Setup Guide

## ✅ Project Complete

Your production-ready MindBridge application has been generated in:
```
c:\Users\User\genAI\mindbridge\
```

## 📦 What's Included

✓ **Backend** (Node.js + Express)
  - Server with Anthropic Claude AI integration
  - `/api/analyze` endpoint for mental health first-aid
  - Rate limiting (20 req/15 mins)
  - CORS configured for localhost:5173

✓ **Frontend** (React 18 + Vite)
  - 7 React components with Framer Motion animations
  - Tailwind CSS with custom sage/dusk/rose color system
  - DM Serif Display + DM Sans typography
  - localStorage persistence for mood history

✓ **Configuration Files**
  - vite.config.js, tailwind.config.js, postcss.config.js
  - .env.example with required variables
  - .gitignore for safe repo initialization

## 🚀 Start in 4 Steps

### 1. Get API Key
Go to https://console.anthropic.com and get your API key

### 2. Install Dependencies
```powershell
cd c:\Users\User\genAI\mindbridge\backend
npm install

cd ..\frontend
npm install
```

### 3. Configure Environment
Edit `c:\Users\User\genAI\mindbridge\backend\.env`:
```
ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE
PORT=3001
NODE_ENV=development
```

### 4. Run Both Servers
**Terminal 1 (Backend):**
```powershell
cd c:\Users\User\genAI\mindbridge\backend
npm run dev
```

**Terminal 2 (Frontend):**
```powershell
cd c:\Users\User\genAI\mindbridge\frontend
npm run dev
```

Then open: http://localhost:5173

## 📁 Directory Structure

```
mindbridge/
├── backend/
│   ├── middleware/rateLimit.js     # Rate limiting
│   ├── routes/analyze.js           # AI analysis logic
│   ├── server.js                   # Express setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatPanel.jsx       # Main chat UI
│   │   │   ├── StressMeter.jsx     # Stress gauge
│   │   │   ├── SuggestionCards.jsx # AI suggestions
│   │   │   ├── EmergencyBanner.jsx # Crisis help
│   │   │   ├── MoodHistory.jsx     # 7-day timeline
│   │   │   ├── DailyCheckIn.jsx    # Quick check-in
│   │   │   └── PromptChips.jsx     # Suggestion prompts
│   │   ├── hooks/useAnalysis.js    # API integration
│   │   ├── utils/storage.js        # localStorage
│   │   ├── App.jsx                 # Main layout
│   │   ├── main.jsx                # React entry
│   │   └── index.css               # Styles + animations
│   ├── public/index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🎨 Design Highlights

- **Soft color palette**: sage (#7a9e7e), dusk (#6b7fa3), rose (#c9837a)
- **Glassmorphism cards**: backdrop blur + semi-transparent white
- **Radial gradient blobs**: Organic, calming background
- **Smooth animations**: Framer Motion for chat, stress meter, suggestion cards
- **Typography**: DM Serif Display for headings, DM Sans for body
- **Responsive**: Desktop sidebar, mobile-optimized layout

## 🧠 AI Integration

Uses Claude Sonnet 4 with strict mental health protocols:
- ✓ Never diagnoses conditions
- ✓ Always uses empathetic language
- ✓ Escalates crisis indicators with helpline resources
- ✓ Provides 3 actionable suggestions per response

## 🚨 Features

✅ Empathetic AI responses
✅ Animated stress level gauge
✅ 7-day mood history (localStorage)
✅ Daily check-in quick button
✅ Crisis escalation with helplines
✅ Suggestion cards (breathing, journaling, movement, etc.)
✅ Rate limiting to prevent abuse
✅ Fully accessible design

## 📝 Environment Variables

**Backend (.env):**
- `ANTHROPIC_API_KEY` — Your Anthropic API key (required)
- `PORT` — Server port (default: 3001)
- `NODE_ENV` — development or production

**Frontend (automatic):**
- `VITE_API_URL` — Backend URL (default: http://localhost:3001)

## ⚠️ Important

1. **Never commit `.env`** — Use `.env.example` as template
2. **Rate limiting** is active in production
3. **localStorage is client-side** — Data stays on user's browser
4. **For deployment**, update `VITE_API_URL` to your backend URL

## 🚀 Next Steps

1. ✅ Install dependencies
2. ✅ Add API key to backend/.env
3. ✅ Run both servers
4. ✅ Test the app
5. ✅ Deploy (see README.md for instructions)

## 📚 Additional Resources

- Anthropic Docs: https://docs.anthropic.com
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Framer Motion: https://www.framer.com/motion/

---

**All files are production-ready with NO placeholders or TODOs.**

Good luck! You've got this. 💙
