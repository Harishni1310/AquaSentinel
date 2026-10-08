import pandas as pd
import joblib


# ==========================================
# 1. LOAD SAVED MODEL
# ==========================================

model = joblib.load("models/random_forest_model.pkl")
label_encoder = joblib.load("models/label_encoder.pkl")

print("Model loaded successfully!")


# ==========================================
# 2. GET INPUT FROM USER
# ==========================================

print("\n==========================================")
print("WATER QUALITY PREDICTION")
print("==========================================")

average_water_speed = float(input("Average Water Speed: "))
average_water_direction = float(input("Average Water Direction: "))
chlorophyll = float(input("Chlorophyll: "))
temperature = float(input("Temperature: "))
dissolved_oxygen = float(input("Dissolved Oxygen: "))
dissolved_oxygen_saturation = float(
    input("Dissolved Oxygen (%Saturation): ")
)
ph = float(input("pH: "))
salinity = float(input("Salinity: "))
turbidity = float(input("Turbidity: "))

year = int(input("Year: "))
month = int(input("Month: "))
day = int(input("Day: "))
hour = int(input("Hour: "))
day_of_week = int(input("DayOfWeek: "))


# ==========================================
# 3. CREATE INPUT DATAFRAME
# ==========================================

input_data = pd.DataFrame([[
    average_water_speed,
    average_water_direction,
    chlorophyll,
    temperature,
    dissolved_oxygen,
    dissolved_oxygen_saturation,
    ph,
    salinity,
    turbidity,
    year,
    month,
    day,
    hour,
    day_of_week
]], columns=[
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
    "DayOfWeek"
])


# ==========================================
# 4. MAKE PREDICTION
# ==========================================

prediction = model.predict(input_data)


# ==========================================
# 5. CONVERT NUMBER TO CLASS NAME
# ==========================================

result = label_encoder.inverse_transform(prediction)


# ==========================================
# 6. DISPLAY RESULT
# ==========================================

print("\n==========================================")
print("PREDICTION RESULT")
print("==========================================")

print("Water Quality Status:", result[0])

