import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns


# ==========================================
# 1. LOAD DATASET
# ==========================================

df = pd.read_csv("dataset/brisbane_water_quality.csv")

print("========== ORIGINAL DATASET ==========")
print("Shape:", df.shape)

print("\nColumns:")
print(df.columns.tolist())


# ==========================================
# 2. BASIC DATA INFORMATION
# ==========================================

print("\n========== DATA TYPES ==========")
print(df.dtypes)

print("\n========== MISSING VALUES ==========")
print(df.isnull().sum())

print("\n========== MISSING VALUE PERCENTAGE ==========")
missing_percentage = (df.isnull().sum() / len(df)) * 100
print(missing_percentage.sort_values(ascending=False))

print("\n========== DUPLICATE ROWS ==========")
print(df.duplicated().sum())

print("\n========== TARGET DISTRIBUTION ==========")
print(df["Water_Quality_Status"].value_counts())

print("\n========== TARGET PERCENTAGE ==========")
print(
    df["Water_Quality_Status"]
    .value_counts(normalize=True)
    .mul(100)
    .round(2)
)


# ==========================================
# 3. HANDLE MISSING VALUES
# ==========================================

numerical_columns = df.select_dtypes(
    include=["float64", "int64"]
).columns

for column in numerical_columns:
    df[column] = df[column].fillna(df[column].median())

print("\n========== MISSING VALUES AFTER CLEANING ==========")
print(df.isnull().sum())


# ==========================================
# 4. REMOVE DUPLICATES
# ==========================================

duplicates_before = df.duplicated().sum()

df = df.drop_duplicates().reset_index(drop=True)

duplicates_after = df.duplicated().sum()

print("\n========== DUPLICATE REMOVAL ==========")
print("Duplicates before:", duplicates_before)
print("Duplicates after:", duplicates_after)

print("\nCleaned dataset shape:", df.shape)


# ==========================================
# 5. CONVERT TIMESTAMP
# ==========================================

df["Timestamp"] = pd.to_datetime(
    df["Timestamp"],
    unit="D",
    origin="1899-12-30"
).dt.round("s")

print("\n========== TIMESTAMP ==========")
print(df["Timestamp"].head())

print("\nTimestamp data type:")
print(df["Timestamp"].dtype)


# ==========================================
# 6. CREATE TIME FEATURES
# ==========================================

df["Year"] = df["Timestamp"].dt.year
df["Month"] = df["Timestamp"].dt.month
df["Day"] = df["Timestamp"].dt.day
df["Hour"] = df["Timestamp"].dt.hour
df["DayOfWeek"] = df["Timestamp"].dt.dayofweek

print("\n========== TIME FEATURES ==========")
print(
    df[
        [
            "Timestamp",
            "Year",
            "Month",
            "Day",
            "Hour",
            "DayOfWeek"
        ]
    ].head()
)


# ==========================================
# 7. TARGET DISTRIBUTION GRAPH
# ==========================================

plt.figure(figsize=(8, 5))

sns.countplot(
    data=df,
    x="Water_Quality_Status"
)

plt.title("Water Quality Status Distribution")
plt.xlabel("Water Quality Status")
plt.ylabel("Number of Samples")

plt.tight_layout()
plt.show()


# ==========================================
# 8. NUMERICAL FEATURES
# ==========================================

numerical_features = [
    "Average Water Speed",
    "Average Water Direction",
    "Chlorophyll",
    "Temperature",
    "Dissolved Oxygen",
    "Dissolved Oxygen (%Saturation)",
    "pH",
    "Salinity",
    "Turbidity"
]


# ==========================================
# 9. FEATURE DISTRIBUTION
# ==========================================

for feature in numerical_features:

    plt.figure(figsize=(8, 5))

    sns.histplot(
        data=df,
        x=feature,
        kde=True
    )

    plt.title(f"Distribution of {feature}")
    plt.xlabel(feature)
    plt.ylabel("Frequency")

    plt.tight_layout()
    plt.show()


# ==========================================
# 10. CORRELATION HEATMAP
# ==========================================

correlation = df[numerical_features].corr()

plt.figure(figsize=(12, 8))

sns.heatmap(
    correlation,
    annot=True,
    fmt=".2f",
    cmap="coolwarm",
    center=0
)

plt.title("Correlation Between Water Quality Parameters")

plt.tight_layout()
plt.show()


# ==========================================
# 11. FEATURE VS TARGET ANALYSIS
# ==========================================

for feature in numerical_features:

    plt.figure(figsize=(8, 5))

    sns.boxplot(
        data=df,
        x="Water_Quality_Status",
        y=feature
    )

    plt.title(f"{feature} vs Water Quality Status")
    plt.xlabel("Water Quality Status")
    plt.ylabel(feature)

    plt.tight_layout()
    plt.show()


# ==========================================
# 12. GROUP STATISTICS
# ==========================================

print("\n========== FEATURE VALUES BY WATER QUALITY ==========")

for feature in numerical_features:

    print(f"\n--- {feature} ---")

    print(
        df.groupby("Water_Quality_Status")[feature]
        .agg(["mean", "median", "min", "max"])
        .round(3)
    )


# ==========================================
# 13. SAVE CLEANED DATASET
# ==========================================

df.to_csv(
    "dataset/water_quality_cleaned.csv",
    index=False
)

print("\n==========================================")
print("CLEANED DATASET SAVED SUCCESSFULLY")
print("File: dataset/water_quality_cleaned.csv")
print("Final Shape:", df.shape)
print("==========================================")