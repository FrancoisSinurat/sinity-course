"use client";

import { useEnrolledCourses } from "@/app/hooks/useEnrolledHistory";
import EnrolledCourseCard from "@/components/CourseComponent/FetchAllCourse/EnrollCourseCard";
import { useCompletedCourses } from "@/app/hooks/useCompleteCourse";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EnrolledCourseList() {
  const { courses, loading, error } = useEnrolledCourses();
  const {
    fetchCompletedCourses,
    completedCourses,
    loading: loadingCompleted,
  } = useCompletedCourses();

  const router = useRouter();

  useEffect(() => {
    fetchCompletedCourses(); // ✅ auto-fetch completed courses saat komponen load
  }, [fetchCompletedCourses]);

  if (loading || loadingCompleted)
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

      <div className="grid md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <EnrolledCourseCard
            key={course.course_id_int}
            course={course}
            isCompleted={completedCourses.includes(course.course_id_int)} // ✅ kirim status selesai
            onClick={() => router.push(`/course/${course.course_id_int}`)}
          />
        ))}
      </div>
    </section>
  );
}
