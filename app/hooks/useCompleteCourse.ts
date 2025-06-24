import { useState, useCallback } from "react";
import { useAuthStore } from "@/app/store/AuthStore";

export function useCompletedCourses() {
  const token = useAuthStore((state) => state.token); // ✅ token langsung dari Zustand
  const [completedCourses, setCompletedCourses] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCompletedCourses = useCallback(async () => {
    setLoading(true);
    setError("");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const res = await fetch(`${apiUrl}/complete-course`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("HTTP error " + res.status);
      }

      const data = await res.json();

      if (data.completed_courses?.length > 0) {
        const ids = data.completed_courses.map(
          (c: { course_id_int: number }) => c.course_id_int
        );
        setCompletedCourses(ids);
      } else {
        setCompletedCourses([]);
      }

    } catch (err) {
      setError("Gagal mengambil daftar kursus yang telah diselesaikan.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    fetchCompletedCourses,
    completedCourses,
    setCompletedCourses,
    loading,
    error,
  };
}
