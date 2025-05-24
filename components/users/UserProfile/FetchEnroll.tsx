"use client";

import { useEnrolledCourses } from "@/app/hooks/useEnrolledHistory";
import EnrolledCourseCard from "@/components/CourseComponent/FetchAllCourse/EnrollCourseCard";
import { useRouter } from "next/navigation";

export default function EnrolledCourseList() {
  const { courses, loading, error } = useEnrolledCourses();
  const router = useRouter();

  if (loading)
    return (
      <div className="animate-pulse text-sm text-gray-500">
        Memuat kursus terdaftar...
      </div>
    );

  if (error)
    return <p className="text-red-500 text-sm font-medium">{error}</p>;

  if (courses.length === 0)
    return (
      <div className="text-gray-500 text-sm italic">
        Kamu belum mendaftar kursus apapun.
      </div>
    );

  return (
    <section className="mt-6">
      <h2 className="text-2xl font-bold text-neutral-800 mb-6">Riwayat Kursus</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <EnrolledCourseCard
            key={course.course_id_int}
            course={course}
            onClick={() => router.push(`/course/${course.course_id_int}`)}
          />
        ))}
      </div>
    </section>
  );
}
