import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/store/AuthStore";

export type Course = {
  course_id_int: number;
  name: string;
  total_reviewers: number;
  average_rating: number;
};

export function useEnrollRecommendation() {
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = useAuthStore((state) => state.token);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/recommend_by_enroll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Gagal fetch rekomendasi.");
        const data = await res.json();
        setRecommendedCourses(data.recommendations ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, apiUrl]);

  return { recommendedCourses, loading, error };
}
