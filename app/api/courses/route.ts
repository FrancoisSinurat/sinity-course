import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "coursea_data.csv");

  return new Promise((resolve, reject) => {
    const courses: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        // Pastikan semua data valid sebelum dimasukkan ke dalam array
        courses.push({
          id: row.course_id ? parseInt(row.course_id) : null, // Pastikan ID valid
          title: row.course_title?.trim() || "Untitled Course",
          rating: parseFloat(row.course_rating) || 0, // Gunakan parseFloat agar tidak undefined
          num_enrolled_students: parseInt(row.course_students_enrolled) || 0,
          difficulty_level: row.course_difficulty?.trim() || "Unknown",
        });
      })
      .on("end", () => {
        resolve(NextResponse.json(courses));
      })
      .on("error", (error) => {
        console.error("Error reading CSV:", error);
        resolve(NextResponse.json({ error: "Failed to read CSV file" }, { status: 500 }));
      });
  });
}
