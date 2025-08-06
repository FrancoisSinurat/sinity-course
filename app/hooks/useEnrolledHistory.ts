"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/store/AuthStore";

interface EnrolledCourse {
  course_id_int: number;
  name: string;
  total_reviewers: number;
  average_rating: number;
}

export function useEnrolledCourses(page=1, limit = 5) {
  const token = useAuthStore((state) => state.token);
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/enrolled-courses?page=${page}&limit=${limit}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || "Gagal mengambil kursus");
        }
        return res.json();
      })
      .then((data) => {
        console.log("API RESPONSE:", data); // 👈 Tambahin ini
        // ✅ Sesuaikan dengan key dari backend
        setCourses(data.enrolled_courses ?? []);
        setTotalPages(data.total_pages );
        setTotalCount(data.total_count );
        setError("");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Gagal fetch data");
      })
      .finally(() => setLoading(false));
  }, [token, page, limit]);

  return { courses, loading, error, totalPages, totalCount };
}
