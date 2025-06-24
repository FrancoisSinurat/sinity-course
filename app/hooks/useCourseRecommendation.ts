import { useState, useEffect } from "react";
import { fetchMe } from "@/lib/api/auth";
import { useAuthStore } from "@/app/store/AuthStore";

export type Course = {
  course_id_int: number;
  name: string;
  total_reviewers: number;
  average_rating: number;
};

export function useCourseRecommendation(course_id: string | string[] | undefined) {
  const [basedOnCourse, setBasedOnCourse] = useState<Course | null>(null);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!course_id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/recommend_by_course?course_id=${course_id}`);
        if (!res.ok) throw new Error("Gagal fetch rekomendasi.");
        const data = await res.json();
        setBasedOnCourse(data.based_on_course);
        setRecommendedCourses(data.recommendations);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [course_id, apiUrl]);

  return { basedOnCourse, recommendedCourses, loading, error };
}

export type User = {
  user_id: number;
  name: string;
  email: string;
  enrolled_courses: number[];
  completed_courses?: number[];
};

export function useUser() {
  const token = useAuthStore((state) => state.token);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!token) return;

    fetchMe(token)
      .then((data) => {
        setUser({
          user_id: data.user_id,
          name: data.name,
          email: data.email,
          enrolled_courses: data.enrolled_courses ?? [],
        });
      })
      .catch(() => setUser(null));
  }, [token]);

  return { user, setUser, token };
}
