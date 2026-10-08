import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report


# ==========================================
# 1. LOAD CLEANED DATASET
# ==========================================

df = pd.read_csv("dataset/water_quality_cleaned.csv")

print("==========================================")
print("DATASET LOADED")
print("==========================================")

print("Shape:", df.shape)
print("Columns:", df.columns.tolist())


# ==========================================
# 2. SELECT FEATURES
# ==========================================

features = [
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
]

target = "Water_Quality_Status"

X = df[features]
y = df[target]


# ==========================================
# 3. ENCODE TARGET
# ==========================================

label_encoder = LabelEncoder()

y_encoded = label_encoder.fit_transform(y)

print("\nClass Mapping:")

for i, class_name in enumerate(label_encoder.classes_):
    print(class_name, "->", i)


# ==========================================
# 4. TRAIN TEST SPLIT
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.20,
    random_state=42,
    stratify=y_encoded
)

print("\n==========================================")
print("DATA SPLIT")
print("==========================================")

print("Training samples:", len(X_train))
print("Testing samples:", len(X_test))


# ==========================================
# 5. RANDOM FOREST MODEL
# ==========================================

print("\n==========================================")
print("TRAINING RANDOM FOREST")
print("==========================================")

model = RandomForestClassifier(
    n_estimators=200,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

print("Random Forest training completed!")


# ==========================================
# 6. PREDICTION
# ==========================================

y_pred = model.predict(X_test)


# ==========================================
# 7. MODEL EVALUATION
# ==========================================

accuracy = accuracy_score(y_test, y_pred)

precision = precision_score(
    y_test,
    y_pred,
    average="weighted"
)

recall = recall_score(
    y_test,
    y_pred,
    average="weighted"
)

f1 = f1_score(
    y_test,
    y_pred,
    average="weighted"
)


print("\n==========================================")
print("RANDOM FOREST RESULTS")
print("==========================================")

print("Accuracy :", round(accuracy, 4))
print("Precision:", round(precision, 4))
print("Recall   :", round(recall, 4))
print("F1 Score :", round(f1, 4))


# ==========================================
# 8. CLASSIFICATION REPORT
# ==========================================

print("\n==========================================")
print("CLASSIFICATION REPORT")
print("==========================================")

print(
    classification_report(
        y_test,
        y_pred,
        target_names=label_encoder.classes_
    )
)


# ==========================================
# 9. FEATURE IMPORTANCE
# ==========================================

print("\n==========================================")
print("FEATURE IMPORTANCE")
print("==========================================")

importance = pd.DataFrame({
    "Feature": features,
    "Importance": model.feature_importances_
})

importance = importance.sort_values(
    by="Importance",
    ascending=False
)

print(importance)


# ==========================================
# 10. SAVE MODEL
# ==========================================

print("\n==========================================")
print("SAVING MODEL")
print("==========================================")

joblib.dump(
    model,
    "models/random_forest_model.pkl"
)

joblib.dump(
    label_encoder,
    "models/label_encoder.pkl"
)

print("Random Forest model saved successfully!")
print("File: models/random_forest_model.pkl")

print("Label encoder saved successfully!")
print("File: models/label_encoder.pkl")


# ==========================================
# 11. FINAL MESSAGE
# ==========================================

print("\n==========================================")
print("MODEL TRAINING COMPLETED")
print("==========================================")

print("Final Model: Random Forest")
print("Accuracy:", round(accuracy * 100, 2), "%")