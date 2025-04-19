"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RatingStars from "@/components/ui/ratingstars";
import { getToken } from "@/lib/auth";

interface Course {
  course_id: string;
  name: string;
  rating: number;
  total_reviewers: number;
  average_rating: number;
}

function formatTotalReviews(totalreviews: number): string {
  return totalreviews >= 1000 ? `${(totalreviews / 1000).toFixed(1)}k` : totalreviews.toString();
}

export default function UserCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUserCourses = async () => {
      setLoading(true);
      const token = getToken();
      if (!token) {
        setError("Kamu belum login.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Gagal mengambil data: ${res.statusText}`);
        const data = await res.json();
        setCourses(data.rated_courses || []);
      } catch (err) {
        console.error("Error fetching user courses:", err);
        setError("Terjadi kesalahan saat mengambil data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserCourses();
  }, []);

  return (
    <div className="w-full p-4 bg-white shadow-lg rounded-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold">
          Kursus yang Kamu Beri Rating
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-gray-500 text-center">Memuat data...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card
                key={course.course_id}
                className="p-3 border shadow-md text-center text-sm hover:shadow-lg transition hover:scale-105 cursor-pointer"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-md font-inter capitalize">
                    {course.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="text-gray-600 text-sm flex items-center gap-1">
                    <RatingStars rating={course.rating} />
                    <span className="font-semibold text-yellow-600">
                      {course.rating.toFixed(1)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            Tidak ada kursus yang diberikan rating.
          </p>
        )}
      </CardContent>
    </div>
  );
}
