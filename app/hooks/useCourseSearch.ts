import { useState, useCallback } from "react";

export interface CourseRecommendationType {
  course_id_int: number;
  name: string;
  total_reviewers: number;
  average_rating: number;
  isTopRated?: boolean;
}

export function useCourseSearch(apiUrl: string) {
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState<CourseRecommendationType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRecommendations = useCallback(async () => {
    const trimmed = query.trim();
    if (trimmed.split(/\s+/).length === 0) {
      setError("Masukkan minimal dua kata.");
      setRecommendations([]);
      return;
    }
  
    setLoading(true);
    setError("");
  
    try {
      const res = await fetch(`${apiUrl}/search_course?course_name=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
  
      // Proses data untuk mengambil 2 rekomendasi terbaik berdasarkan rating
      const topTwoIds = [...data.recommendations]
        .sort((a, b) => b.total_reviewers - a.total_reviewers)
        .slice(0, 2)
        .map((item) => item.course_id_int);
  
      // Map dan proses data
      const processed = data.recommendations.map((course: CourseRecommendationType) => ({
        ...course,
        average_rating: parseFloat(course.average_rating.toFixed(2)),
        isTopRated: topTwoIds.includes(course.course_id_int),
      }));
  
      
      setRecommendations(processed);
      console.log(processed);  // Cek apakah total_reviewers sudah benar

    } catch {
      setError("Gagal mengambil data.");
    } finally {
      setLoading(false);
    }
  }, [query, apiUrl]);
  
  return {
    query,
    setQuery,
    fetchRecommendations,
    recommendations,
    loading,
    error,
  };
}
