"use client";

import { useParams, useRouter } from "next/navigation";
import CourseCard from "@/components/CourseComponent/FetchAllCourse/CourseCard";
import { useCourseRecommendation, useUser } from "@/app/hooks/useCourseRecommendation";
import { useState } from "react";
import { formatTotalReviews } from "@/components/ui/formatrevies";


export default function RecommendByCoursePage() {
  const { course_id } = useParams();
  const router = useRouter();
  const { basedOnCourse, recommendedCourses, loading, error } = useCourseRecommendation(course_id);
  const { user, setUser, token } = useUser();
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  async function handleEnroll(course_id: number) {
    if (!user) {
      router.push("/login");
      return;
    }

    setEnrollingId(course_id);
    try {
      const res = await fetch(`${apiUrl}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course_id_int: course_id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Gagal mendaftar kursus.");
      }

      const data = await res.json();
      alert(data.message);

      setUser((prev) =>
        prev ? { ...prev, enrolled_courses: [...prev.enrolled_courses, course_id] } : prev
      );

      router.push(`/course/${course_id}`);
    } catch (error: unknown) {
      alert((error as Error)?.message ?? "Terjadi kesalahan saat mendaftar kursus.");
    } finally {
      setEnrollingId(null);
    }
  }

  function isEnrolled(id: number) {
    return user?.enrolled_courses.includes(id) ?? false;
  }

  return (
    <div className="px-8 pt-24 flex flex-col w-full min-h-screen space-y-8">
      {basedOnCourse && (
        <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold capitalize mb-2">{basedOnCourse.name}</h2>
          <p className="text-sm text-gray-600 mb-4">{basedOnCourse.category}</p>
          <div className="flex items-center gap-4 mb-4">
            <span className="font-semibold text-yellow-600 flex items-center gap-1">
              <span>⭐</span> {basedOnCourse.average_rating.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">{formatTotalReviews(basedOnCourse.total_reviewers)} reviewers</span>
          </div>
          <button
            onClick={() => handleEnroll(basedOnCourse.course_id_int)}
            disabled={enrollingId === basedOnCourse.course_id_int || isEnrolled(basedOnCourse.course_id_int)}
            className={`bg-blue-600 hover:bg-blue-700 text-white rounded px-6 py-2 font-semibold w-50 transition ${
              enrollingId === basedOnCourse.course_id_int || isEnrolled(basedOnCourse.course_id_int)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isEnrolled(basedOnCourse.course_id_int)
              ? "Sudah Terdaftar"
              : enrollingId === basedOnCourse.course_id_int
              ? "Mendaftar..."
              : "Enroll Kursus Ini"}
          </button>
        </div>
      )}

      <h1 className="text-xl font-bold">
        Kursus Serupa - <span className="text-blue-500 capitalize">{basedOnCourse?.name || course_id}</span>
      </h1>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-300 animate-pulse rounded" />
          ))}
        </div>
      )}

      {error && <p className="text-red-600">{error}</p>}

      {!loading && recommendedCourses.length === 0 && (
        <p className="text-gray-600">Tidak ada rekomendasi ditemukan.</p>
      )}

      {!loading && recommendedCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedCourses.map((course) => (
            <CourseCard
              key={course.course_id_int}
              course={course}
              onEnroll={handleEnroll}
              isEnrolled={isEnrolled}
              enrollingId={enrollingId}
              onClick={() => router.push(`/course/${course.course_id_int}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
