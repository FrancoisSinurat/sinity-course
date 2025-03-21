from fastapi import FastAPI, Query
from typing import List
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

# TAMBAHIN PREPROCESSING COURSE_ID JADI UNIQUE / NUMBER KEK PUNYA KAK NABILA
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Bisa diubah ke ["http://localhost:3000"] untuk keamanan
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ==========================
# CONTENT BASED FILTERING
# ==========================

# ==========================
# 1️⃣ Load & Preprocessing Data
# ==========================
df = pd.read_csv("clean_courses.csv")
df = df.dropna(subset=["name"])
df["name"] = df["name"].astype(str).apply(lambda x: x.replace('"', '').replace("'", "").strip().lower())

vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(2, 2))
tfidf_matrix = vectorizer.fit_transform(df["name"])
cosine_sim_matrix = cosine_similarity(tfidf_matrix, tfidf_matrix)

# ==========================
# 2️⃣ API Endpoint untuk Rekomendasi
# ==========================
@app.get("/dashboard", response_model=dict)
async def recommend_courses(course_name: str = Query(..., title="Nama Kursus")):
    course_name = course_name.lower().strip()
    matched_courses = df[df["name"].str.contains(course_name, case=False, na=False)]

    if matched_courses.empty:
        return {"message": f"Kursus '{course_name}' tidak ditemukan. Coba cari yang lain.", "recommendations": []}

    idx = matched_courses.index[0]
    sim_scores = list(enumerate(cosine_sim_matrix[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:6]

    recommendations = [{"name": df.iloc[i[0]]["name"], "similarity": round(i[1], 4)} for i in sim_scores]

    return {"search_name": course_name, "recommendations": recommendations}

# ==========================
# 3️⃣ API Endpoint untuk Mengambil Semua Kursus
# ==========================
@app.get("/courses", response_model=dict)
async def get_all_courses():
    courses = df["name"].tolist()
    return {"courses": [{"name": name} for name in courses]}

# ==========================
# 4️⃣ Menjalankan API FastAPI
# ==========================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
