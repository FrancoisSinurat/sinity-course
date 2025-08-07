"use client";

import { useState, useEffect } from "react";
import { useEnrolledCourses } from "@/app/hooks/useEnrolledHistory";
import EnrolledCourseCard from "@/components/CourseComponent/FetchAllCourse/EnrollCourseCard";
import { useCompletedCourses } from "@/app/hooks/useCompleteCourse";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function EnrolledCourseList() {
  const [page, setPage] = useState(1);
  const limit = 5;
  const { courses, loading, error, totalPages, totalCount } =
    useEnrolledCourses(page, limit);
  const { fetchCompletedCourses, completedCourses, loading: loadingCompleted } =
    useCompletedCourses();

  const router = useRouter();

  useEffect(() => {
    fetchCompletedCourses();
  }, [fetchCompletedCourses]);

  if (loading || loadingCompleted)
    return <p className="text-sm text-gray-500">Memuat kursus...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <section className="mt-6 p-4 ">
      <h2 className="text-2xl font-bold text-neutral-800 mb-2">Riwayat Kursus</h2>
      <p className="text-sm text-gray-600 mb-4">
        Total kursus terdaftar:{" "}
        <span className="font-semibold">{totalCount}</span>
      </p>

      {courses.length === 0 ? (
        <p className="text-gray-500 italic">Belum ada kursus.</p>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="grid md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {courses.map((course) => (
                <EnrolledCourseCard
                  key={course.course_id_int}
                  course={course}
                  isCompleted={completedCourses.includes(course.course_id_int)}
                  onClick={() => router.push(`/course/${course.course_id_int}`)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  page === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border shadow-sm hover:bg-gray-100"
                }`}
              >
                ⬅ Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <motion.button
                  key={p}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePageChange(p)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    page === p
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-white border hover:bg-gray-100"
                  }`}
                >
                  {p}
                </motion.button>
              ))}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  page === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border shadow-sm hover:bg-gray-100"
                }`}
              >
                Next ➡
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
