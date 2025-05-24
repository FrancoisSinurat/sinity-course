// hooks/fetchAllCourses.ts
import { useState, useCallback } from "react";

export interface Course {
  course_id_int: number;
  name: string;
  category:string;
  total_reviewers: number;
  average_rating: number;
}

export function usePaginatedCourses(apiUrl: string) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCoursesByPage = useCallback(
    async (page: number, limit = 20, categoryPreference?: string) => {
      setLoading(true);
      try {
        const url = new URL(`${apiUrl}/courses`);
        url.searchParams.append("page", page.toString());
        url.searchParams.append("limit", limit.toString());
        if (categoryPreference) url.searchParams.append("category", categoryPreference);

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Response not OK");
        const data = await response.json();

        setCourses(data.courses);
        setTotalPages(Math.ceil(data.total / limit));
        setError(null);
      } catch (err) {
        setError("Gagal memuat kursus");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [apiUrl]
  );

  return { courses, loading, error, totalPages, fetchCoursesByPage };
}
