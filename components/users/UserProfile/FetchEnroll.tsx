// components/users/UserProfile/EnrolledCourseList.tsx
"use client";

import { useEnrolledCourses } from "@/app/hooks/useEnrolledHistory";

export default function EnrolledCourseList() {
  const { courses, loading, error } = useEnrolledCourses();

  if (loading) return <p>Memuat kursus terdaftar...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (courses.length === 0) return <p>Kamu belum mendaftar kursus apapun.</p>;

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Riwayat Kursus Terdaftar</h2>
      <ul className="space-y-4">
        {courses.map((course) => (
          <li
            key={course.course_id_int}
            className="border p-4 rounded shadow flex flex-col"
          >
            <span className="font-semibold text-blue-600 text-lg">{course.name}</span>
            <span className="text-sm text-gray-600">{course.category}</span>
            <span className="text-sm text-yellow-600 flex items-center gap-1">
              {course.average_rating.toFixed(2)} <span>⭐</span> ({course.total_reviewers} reviewers)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
