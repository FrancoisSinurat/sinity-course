import yaml
import csv

def convert_yaml_to_csv(yaml_file, csv_file):
    # Buka file YAML
    with open(yaml_file, "r") as file:
        data = yaml.safe_load(file)

    # Pastikan data berbentuk list of dictionaries
    if isinstance(data, dict):
        data = [data]

    # Tentukan header berdasarkan kunci dalam dictionary pertama
    header = data[0].keys() if data else []

    # Tulis ke file CSV
    with open(csv_file, "w", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=header)
        writer.writeheader()
        writer.writerows(data)

    print(f"Konversi selesai! File CSV telah dibuat sebagai '{csv_file}'.")

# Konversi masing-masing file YAML
convert_yaml_to_csv("udemy-data/udemy-courses/courses.yaml", "udemy_courses.csv")
convert_yaml_to_csv("udemy-data/udemy-reviews/reviews.yaml", "udemy_reviews.csv")
