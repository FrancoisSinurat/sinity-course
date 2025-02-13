import pandas as pd

# Load CSV reviews dan courses
df_reviews = pd.read_csv("Coursera_reviews.csv")  # File review
df_courses = pd.read_csv("Coursera_courses.csv")  # File course



# Cek struktur data
print(df_reviews.head())
print(df_courses.head())

# Ambil daftar course_id unik dari kedua dataset
course_ids_review = set(df_reviews["course_id"].unique())
course_ids_course = set(df_courses["course_id"].unique())

# Cek course_id yang ada di review tapi tidak ada di courses
missing_courses = course_ids_review - course_ids_course

print(f"Jumlah course_id yang tidak cocok: {len(missing_courses)}")
print("Course ID yang tidak ada di courses.csv:", missing_courses)

# Filter hanya review dengan course_id yang valid
df_valid_reviews = df_reviews[df_reviews["course_id"].isin(course_ids_course)]

# Simpan hasil ke CSV baru
df_valid_reviews.to_csv("filtered_reviews.csv", index=False)
print("Data review sudah difilter dan disimpan sebagai 'filtered_reviews.csv'")

# Cek course_id yang ada di course.csv tapi tidak ada di review.csv
unused_courses = course_ids_course - course_ids_review

print(f"Jumlah course tanpa review: {len(unused_courses)}")
print("Course ID tanpa review:", unused_courses)

