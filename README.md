<div align="center">

# 🚀 SPACE-X

### **AI-Powered Space Weather Monitoring Dashboard**

_Real-time space weather intelligence — powered by NOAA data, anomaly detection, and predictive analytics._

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Python](https://img.shields.io/badge/Python-AI_Model-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

---

**[Live Demo →](#) · [Report Bug →](../../issues) · [Request Feature →](../../issues)**

</div>

---

## 🌌 Overview

**SPACE-X** is a full-stack, real-time space weather monitoring platform that tracks solar wind, radiation levels, and geomagnetic storm indices using live data from **NOAA's Space Weather Prediction Center**. The system features an AI-driven anomaly detection engine, predictive stability scoring, and a stunning mission-control-style dashboard with animated star backgrounds.

> _"Mission Control, but for space weather."_

---

## ✨ Features

| Feature | Description |
|---|---|
| 🛰️ **Real-Time Sensor Dashboard** | Live-updating tiles for solar wind speed, proton flux radiation, and geomagnetic Kp index |
| 🎯 **Stability Ring** | Visual radial gauge showing pattern stability scores (0–100%) per sensor |
| 📈 **Trend Graphs** | Interactive time-series charts tracking up to 60 data points with Recharts |
| ⚠️ **Anomaly Detection Feed** | Severity-graded anomaly alerts (low → critical) with acknowledgment tracking |
| 🤖 **AI Insight Panel** | Predictive analysis with drift probability, forecasted conditions, and crew recommendations |
| 🌟 **Star Background** | Immersive animated space-themed canvas behind all views |
| ⚙️ **Settings Page** | Configurable dashboard preferences and display options |
| 🔄 **Auto-Polling** | Dashboard auto-refreshes every 5 seconds for near-real-time updates |
| 🩺 **Health Endpoint** | Backend health check API for uptime monitoring |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        🌍 NOAA SWPC APIs                        │
│          (Solar Wind · Proton Flux · Geomagnetic Kp)             │
└────────────────────────────┬─────────────────────────────────────┘
                             │ HTTP
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                    🐍 AI Model (Python)                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │ Data Fetcher │→ │  Stability   │→ │  Anomaly Detection     │  │
│  │  (NOAA API)  │  │  Scoring     │  │  (Threshold + Z-Score) │  │
│  └─────────────┘  └──────────────┘  └────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────┘
                             │ POST /api/*
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                  🟢 Backend (Express.js)                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐  │
│  │  /sensor   │  │  /anomaly  │  │ /stability │  │ /health  │  │
│  └─────┬──────┘  └─────┬──────┘  └──────┬─────┘  └────┬─────┘  │
│        └───────────────┴────────────────┴──────────────┘        │
│                          Supabase                                │
└────────────────────────────┬─────────────────────────────────────┘
                             │ REST API
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                  ⚛️ Frontend (React + TypeScript)                │
│  ┌───────────┐ ┌──────────┐ ┌───────────┐ ┌──────────────────┐ │
│  │ Dashboard  │ │Anomalies │ │ Stability │ │  AI Insights     │ │
│  │ StatusTile │ │  Feed    │ │   Ring    │ │  Predictions     │ │
│  │ TrendGraph │ │          │ │           │ │  Drift Analysis  │ │
│  └───────────┘ └──────────┘ └───────────┘ └──────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** — Component-driven UI with strong typing
- **Vite 5** — Lightning-fast HMR and builds
- **Tailwind CSS 3** — Utility-first styling with custom space theme
- **shadcn/ui** + **Radix UI** — Accessible, beautiful component library
- **Recharts** — Interactive data visualization
- **React Router 6** — Client-side routing
- **TanStack Query** — Server-state management
- **Lucide React** — Crisp icon system

### Backend
- **Express.js 4** — RESTful API server
- **Supabase (PostgreSQL)** — Managed database with Row-Level Security
- **CORS + Middleware** — Request logging, error handling, and security
- **Vercel Serverless** — Production deployment ready

### AI Model
- **Python 3** — Data processing and analysis engine
- **NOAA SWPC Integration** — Real-time solar wind, radiation, and Kp data
- **Rolling Window Stability** — Coefficient of Variation scoring algorithm
- **Linear Regression Drift** — Trend detection via slope analysis
- **Z-Score Anomaly Detection** — Statistical threshold-based alerting

---

## 📂 Project Structure

```
SPACE-X/
├── frontend/                  # React + TypeScript frontend
│   ├── api/                   # Vercel serverless API proxies
│   │   ├── anomaly.js         # Anomaly endpoint proxy
│   │   ├── health.js          # Health check proxy
│   │   ├── sensor.js          # Sensor data proxy
│   │   └── stability.js       # Stability scores proxy
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── AIInsightPanel.tsx
│   │   │   ├── AnomalyFeed.tsx
│   │   │   ├── AppSidebar.tsx
│   │   │   ├── StabilityRing.tsx
│   │   │   ├── StarBackground.tsx
│   │   │   ├── StatusTile.tsx
│   │   │   ├── TrendGraph.tsx
│   │   │   └── ui/            # shadcn/ui primitives
│   │   ├── hooks/
│   │   │   └── useSpaceXData.ts  # Central data-fetching hook
│   │   ├── pages/
│   │   │   ├── Index.tsx      # Main dashboard
│   │   │   ├── Anomalies.tsx  # Anomaly log page
│   │   │   ├── Stability.tsx  # Stability metrics page
│   │   │   └── Settings.tsx   # User preferences
│   │   └── App.tsx            # Root app with routing
│   └── package.json
│
├── backend/                   # Express.js API server
│   ├── routes/                # API route handlers
│   ├── middleware/             # Error handler, request logger
│   ├── config/                # Supabase client configuration
│   ├── server.js              # Express app entry point
│   ├── supabase_schema.sql    # Database schema (3 tables)
│   └── package.json
│
└── ai-model/                  # Python AI engine
    ├── main.py                # NOAA fetcher + stability + anomaly detection
    └── requirements.txt       # Python dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.0.0
- **Python** ≥ 3.8
- **Supabase** account (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/SPACE-X.git
cd SPACE-X
```

### 2. Set Up the Database

1. Create a new project on [Supabase](https://supabase.com)
2. Navigate to **SQL Editor** and run the contents of `backend/supabase_schema.sql`
3. Copy your **Project URL** and **Service Role Key** from Settings → API

### 3. Configure the Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 4. Configure the Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

### 5. Start the AI Model

```bash
cd ai-model
pip install -r requirements.txt
python main.py
```

> The AI model will begin polling NOAA APIs and pushing sensor data, stability scores, and anomalies to your backend every polling cycle.

---

## 🗄️ Database Schema

| Table | Description | Key Fields |
|---|---|---|
| `sensor_readings` | Raw sensor measurements from NOAA | `sensor_type`, `value`, `unit`, `recorded_at` |
| `anomalies` | Detected anomalous readings | `severity`, `threshold`, `acknowledged`, `detected_at` |
| `stability_scores` | Rolling-window pattern stability | `score` (0.0–1.0), `drift_detected`, `drift_magnitude` |

All tables use **UUID primary keys**, **JSONB metadata**, and **Row-Level Security** with service role policies.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/sensor/latest` | Latest readings for all sensor types |
| `POST` | `/api/sensor` | Store a new sensor reading |
| `GET` | `/api/anomaly?limit=20` | Recent anomalies (paginated) |
| `GET` | `/api/anomaly/summary` | Count of anomalies by severity |
| `POST` | `/api/anomaly` | Log a detected anomaly |
| `GET` | `/api/stability/latest` | Latest stability scores per sensor |
| `POST` | `/api/stability` | Store a computed stability score |
| `GET` | `/api/health` | Backend health check |

---

## 🌐 Deployment

### Frontend → Vercel

```bash
cd frontend
vercel --prod
```

Set environment variable: `VITE_API_URL` → your deployed backend URL.

### Backend → Vercel (Serverless)

```bash
cd backend
vercel --prod
```

Set environment variables: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `FRONTEND_URL`.

### AI Model → Any Server / Cloud VM

Run `python main.py` on a server with cron or as a persistent process. Set `BACKEND_URL` environment variable to point to your deployed backend.

---

## 🤖 How the AI Model Works

1. **Data Ingestion** — Fetches real-time solar wind speed, proton flux radiation, and geomagnetic Kp index from NOAA SWPC APIs
2. **Stability Scoring** — Computes a 0.0–1.0 stability score using **coefficient of variation** over a rolling window. Lower variability = higher stability
3. **Drift Detection** — Applies **linear regression** on the rolling window to detect upward/downward trends via slope analysis
4. **Anomaly Detection** — Flags readings that exceed statistical thresholds using **Z-score analysis** with severity classification (low → critical)
5. **Backend Sync** — POSTs all computed data (sensor readings, stability scores, anomalies) to the Express backend → Supabase

---

## 📊 Dashboard Components

| Component | Purpose |
|---|---|
| **StatusTile** | Displays live sensor value with color-coded health status |
| **StabilityRing** | Radial gauge visualization of pattern stability percentage |
| **TrendGraph** | Multi-line time-series chart for all three sensor streams |
| **AnomalyFeed** | Scrollable feed of detected anomalies with severity badges |
| **AIInsightPanel** | AI-generated predictions, drift probabilities, and recommendations |
| **StarBackground** | Animated star-field canvas for immersive space atmosphere |

---

## 🧪 Testing

```bash
cd frontend
npm test          # Run once
npm run test:watch  # Watch mode
```

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
<img width="949" height="497" alt="image" src="https://github.com/user-attachments/assets/e8739c2c-490e-48d7-b750-d34a88bf69bd" />
<img width="942" height="503" alt="image" src="https://github.com/user-attachments/assets/c93839c8-58df-4f42-a030-0c1187ac6d0b" />
<img width="454" height="445" alt="image" src="https://github.com/user-attachments/assets/41e270fb-c369-43a8-8918-7e78d2205e7e" />
<img width="930" height="486" alt="image" src="https://github.com/user-attachments/assets/1036dd3d-be6f-4374-9625-562317b67587" />
<img width="805" height="362" alt="image" src="https://github.com/user-attachments/assets/230f114e-30c3-44d1-b6c8-ed2b0eec34bb" />
<img width="768" height="328" alt="image" src="https://github.com/user-attachments/assets/3ffbcf68-d4c1-4c9a-a5f0-506317ba82ff" />







---

<div align="center">

**Built with ❤️ and a fascination for the cosmos**

_"Per aspera ad astra" — Through hardships to the stars_ 🌟

</div>
