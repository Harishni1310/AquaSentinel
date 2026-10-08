# 💧 AquaSense AI — Water Quality Monitoring System

An AI-powered water quality monitoring and prediction web application built with **FastAPI**, **Vite (Vanilla JS)**, and a trained **Random Forest** machine learning model.

The system analyzes **14 environmental parameters** and classifies water quality as **Good**, **Moderate**, or **Poor** in real time.

---

## 📁 Project Structure

```
Water_Quality_Monitoring/
├── backend/
│   ├── api/
│   │   ├── __init__.py
│   │   └── main.py           # FastAPI app & /predict endpoint
│   ├── models/
│   │   ├── random_forest_model.pkl
│   │   └── label_encoder.pkl
│   ├── src/
│   │   ├── data_analysis.py
│   │   ├── model_training.py
│   │   └── prediction.py
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── styles/
│   │   │   └── style.css
│   │   └── main.js
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── nginx.conf
│   └── Dockerfile
├── dataset/
│   ├── brisbane_water_quality.csv
│   └── water_quality_cleaned.csv
├── docker-compose.yml
├── .dockerignore
├── .gitignore
├── requirements.txt
└── README.md
```

---

## 🧠 ML Model

| Property | Detail |
|---|---|
| Algorithm | Random Forest Classifier |
| Input Features | 14 water quality parameters |
| Output Classes | Good · Moderate · Poor |
| Files | `random_forest_model.pkl`, `label_encoder.pkl` |

### Input Parameters

| # | Parameter | Unit |
|---|---|---|
| 1 | Average Water Speed | m/s |
| 2 | Average Water Direction | ° |
| 3 | Chlorophyll | μg/L |
| 4 | Temperature | °C |
| 5 | Dissolved Oxygen | mg/L |
| 6 | Dissolved Oxygen (%Saturation) | % |
| 7 | pH | 0–14 |
| 8 | Salinity | PSU |
| 9 | Turbidity | NTU |
| 10 | Year | — |
| 11 | Month | 1–12 |
| 12 | Day | 1–31 |
| 13 | Hour | 0–23 |
| 14 | DayOfWeek | 0=Mon … 6=Sun |

---

## 🚀 Running the Project

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm 9+
- Git

---

### Option 1 — Run Locally (Development)

#### Step 1 — Clone the repository

```bash
git clone <your-repo-url>
cd Water_Quality_Monitoring
```

#### Step 2 — Create and activate a virtual environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python -m venv venv
source venv/bin/activate
```

#### Step 3 — Install Python dependencies

```bash
pip install -r requirements.txt
```

#### Step 4 — Start the Backend

```bash
cd backend
python -m uvicorn api.main:app --reload --port 8000
```

Backend runs at: **http://localhost:8000**
API docs at: **http://localhost:8000/docs**

#### Step 5 — Start the Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

### Option 2 — Run with Docker (Production)

#### Prerequisites
- Docker Desktop installed and running

#### Step 1 — Clone the repository

```bash
git clone <your-repo-url>
cd Water_Quality_Monitoring
```

#### Step 2 — Build and start all containers

```bash
docker-compose up --build
```

Or run in the background:

```bash
docker-compose up --build -d
```

| Service | URL |
|---|---|
| Frontend | http://localhost |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

#### Step 3 — Stop containers

```bash
docker-compose down
```

#### Rebuild after code changes

```bash
docker-compose up --build
```

---

## 🔌 API Reference

### `GET /`
Health check.

**Response:**
```json
{
  "status": "ok",
  "message": "Water Quality Monitoring API is running"
}
```

---

### `POST /predict`
Predict water quality from input parameters.

**Request Body:**
```json
{
  "Average Water Speed": 0.35,
  "Average Water Direction": 180.0,
  "Chlorophyll": 3.2,
  "Temperature": 25.4,
  "Dissolved Oxygen": 8.4,
  "Dissolved Oxygen (%Saturation)": 95.0,
  "pH": 7.2,
  "Salinity": 0.5,
  "Turbidity": 2.3,
  "Year": 2024,
  "Month": 6,
  "Day": 15,
  "Hour": 12,
  "DayOfWeek": 1
}
```

**Response:**
```json
{
  "prediction": "Good",
  "confidence": {
    "Good": 0.95,
    "Moderate": 0.03,
    "Poor": 0.02
  }
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript, Vite |
| Backend | Python, FastAPI, Uvicorn |
| ML Model | Scikit-learn, Random Forest |
| Data | Pandas, Joblib |
| Containerization | Docker, Docker Compose |
| Web Server | Nginx (production) |

---

## ⚠️ Troubleshooting

| Error | Fix |
|---|---|
| `No module named uvicorn` | Run `pip install -r requirements.txt` |
| `Cannot find module vite` | Run `npm install` inside `frontend/` |
| CORS error in browser | Make sure backend is running on port `8000` |
| Model not found | Ensure `backend/models/*.pkl` files exist |
| Docker port conflict | Change ports in `docker-compose.yml` |

---

## 📄 License

This project is developed as an AIML college project.

---

© 2026 AquaSense AI — Water Quality Monitoring System
