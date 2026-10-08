from pathlib import Path
import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ── Paths ──────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent          # backend/
MODELS_DIR = BASE_DIR / "models"

# ── Load model & encoder once at startup ───────────────────────────────────
model         = joblib.load(MODELS_DIR / "random_forest_model.pkl")
label_encoder = joblib.load(MODELS_DIR / "label_encoder.pkl")

FEATURE_COLUMNS = [
    "Average Water Speed",
    "Average Water Direction",
    "Chlorophyll",
    "Temperature",
    "Dissolved Oxygen",
    "Dissolved Oxygen (%Saturation)",
    "pH",
    "Salinity",
    "Turbidity",
    "Year",
    "Month",
    "Day",
    "Hour",
    "DayOfWeek",
]

# ── App ────────────────────────────────────────────────────────────────────
app = FastAPI(title="Water Quality Monitoring API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# ── Schema ─────────────────────────────────────────────────────────────────
class WaterParams(BaseModel):
    average_water_speed:          float = Field(alias="Average Water Speed")
    average_water_direction:      float = Field(alias="Average Water Direction")
    chlorophyll:                  float = Field(alias="Chlorophyll")
    temperature:                  float = Field(alias="Temperature")
    dissolved_oxygen:             float = Field(alias="Dissolved Oxygen")
    dissolved_oxygen_saturation:  float = Field(alias="Dissolved Oxygen (%Saturation)")
    ph:                           float = Field(alias="pH")
    salinity:                     float = Field(alias="Salinity")
    turbidity:                    float = Field(alias="Turbidity")
    year:                         int   = Field(alias="Year")
    month:                        int   = Field(alias="Month")
    day:                          int   = Field(alias="Day")
    hour:                         int   = Field(alias="Hour")
    day_of_week:                  int   = Field(alias="DayOfWeek")

    model_config = {"populate_by_name": True}

# ── Routes ─────────────────────────────────────────────────────────────────
@app.get("/")
def health():
    return {"status": "ok", "message": "Water Quality Monitoring API is running"}


@app.post("/predict")
def predict(params: WaterParams):
    row = pd.DataFrame([[
        params.average_water_speed,
        params.average_water_direction,
        params.chlorophyll,
        params.temperature,
        params.dissolved_oxygen,
        params.dissolved_oxygen_saturation,
        params.ph,
        params.salinity,
        params.turbidity,
        params.year,
        params.month,
        params.day,
        params.hour,
        params.day_of_week,
    ]], columns=FEATURE_COLUMNS)

    encoded_pred   = model.predict(row)
    probabilities  = model.predict_proba(row)[0]
    class_names    = label_encoder.classes_          # e.g. ['Good','Moderate','Poor']

    prediction     = label_encoder.inverse_transform(encoded_pred)[0]
    confidence     = {cls: round(float(prob), 4)
                      for cls, prob in zip(class_names, probabilities)}

    return {"prediction": prediction, "confidence": confidence}
