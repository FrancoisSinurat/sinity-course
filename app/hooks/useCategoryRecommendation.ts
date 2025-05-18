import { useState, useCallback } from "react";
import { useAuthStore } from "@/app/store/AuthStore";

export interface CategoryRecommendation {
  course_id_int: number;
  name: string;
  category: string;
  similarity: number;
  total_reviewers: number;
  average_rating: number;
}


export function useCategoryRecommendation(apiUrl: string) {
  const token = useAuthStore((state) => state.token);  // ✅ ambil token langsung dari Zustand

  const [recommendations, setRecommendations] = useState<CategoryRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCategoryRecommendation = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${apiUrl}/recommend_course`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("HTTP error " + res.status);
      }

      const data = await res.json();

      if (data.recommendations?.length > 0) {
      const processed = data.recommendations
    .filter((item: CategoryRecommendation) => item.average_rating > 0)
    .map((item: CategoryRecommendation) => ({
      ...item,
      similarity: parseFloat(item.similarity.toFixed(2)),
    }));

      setRecommendations(processed);
    } else {
      setRecommendations([]);
    }

    } catch (err) {
      setError("Gagal mengambil rekomendasi kategori.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token]);  // ✅ tambahkan token ke dependency

  return {
    fetchCategoryRecommendation,
    recommendations,
    loading,
    error,
  };
}
