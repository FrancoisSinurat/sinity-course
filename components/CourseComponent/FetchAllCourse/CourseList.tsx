"use client";

import { useEffect, useState } from "react";
import { usePaginatedCourses } from "@/app/hooks/fetchAllCourses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTotalReviews } from "@/components/ui/formatrevies";

export default function AllCoursesList() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
  const { courses, loading, error, totalPages, fetchCoursesByPage } = usePaginatedCourses(apiUrl);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCoursesByPage(currentPage);
  }, [fetchCoursesByPage, currentPage]);

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Fungsi untuk proses enroll, bisa kamu modifikasi sesuai kebutuhan
  const handleEnroll = (courseId: number, courseName: string) => {
    console.log("Enroll course:", courseId, courseName);
    // Misal: update state, panggil API, dll
  };

  return (
    <div className="p-4 rounded min-h-[80vh] flex flex-col">
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-300 animate-pulse rounded" />
          ))}
        </div>
      )}

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!loading && !error && courses.length === 0 && <p className="mb-4">Tidak ada kursus tersedia.</p>}

      {!loading && !error && courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
          {courses.map((course) => (
            <Card
              key={course.course_id_int}
              className="hover:shadow-lg transition-shadow duration-200 cursor-pointer capitalize flex flex-col"
            >
              <CardHeader>
                <CardTitle className="text-lg">{course.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <p className="text-yellow-600 font-semibold">
                  Rating: {course.average_rating.toFixed(1)} ⭐
                </p>
                <p className="text-gray-600 mb-4">
                  Reviewer: {formatTotalReviews(course.total_reviewers)}
                </p>
                <button
                  onClick={() => handleEnroll(course.course_id_int, course.name)}
                  className="mt-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Enroll
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-4 mt-auto">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1 || loading}
          className="px-4 py-2 rounded border hover:bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="self-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages || loading}
          className="px-4 py-2 rounded border hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
