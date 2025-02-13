import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

export async function GET() {
  // const filePath = path.join(process.cwd(), "public", "courses.csv");
  const filePath = path.join(process.cwd(), "public", "dicoding-course.csv");
  const courses: any[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        courses.push({
          title: row.course_name, // Gunakan nama kursus sebagai judul
          rating: row.rating, // Rating sebagai angka
          num_enrolled_students: parseInt(row.num_enrolled_students), // Rating sebagai angka
          difficulty_level: row.difficulty_level, // Jumlah review sebagai angka
        });
      })
      .on("end", () => {
        resolve(NextResponse.json(courses));
      })
      .on("error", (error) => {
        reject(NextResponse.json({ error: "Failed to read CSV file" }));
      });
  });
}
