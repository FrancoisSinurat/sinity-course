// hooks/useEnrolledCourses.ts
"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/store/AuthStore";

interface EnrolledCourse {
  course_id_int: number;
  name: string;
  category: string;
  total_reviewers: number;
  average_rating: number;
}

export function useEnrolledCourses() {
  const token = useAuthStore((state) => state.token);
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/enrolled-courses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || "Gagal mengambil kursus");
        }
        return res.json();
      })
      .then((data) => {
        setCourses(data.enrolled_courses);
        setError("");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Gagal fetch data");
      })
      .finally(() => setLoading(false));
  }, [token]);

  return { courses, loading, error };
}
