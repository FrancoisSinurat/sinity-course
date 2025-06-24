"use client";

import { useEffect, useState } from "react";
import { usePaginatedCourses } from "@/app/hooks/fetchAllCourses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RatingStars from "@/components/ui/ratingstars";
import { useRouter } from "next/navigation";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Users,
} from "lucide-react";
import { formatTotalReviews } from "@/components/ui/formatrevies";
import { Badge } from "@/components/ui/badge";

export default function AllCoursesList() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
  const router = useRouter();

  const { courses, loading, error, totalPages, fetchCoursesByPage } = usePaginatedCourses(apiUrl);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCoursesByPage(currentPage, 20);
  }, [currentPage, fetchCoursesByPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const renderPaginationButtons = () => {
    const pagesToRender: (number | "...")[] = [];
    const siblingCount = 1;

    const startPage = Math.max(2, currentPage - siblingCount);
    const endPage = Math.min(totalPages - 1, currentPage + siblingCount);

    pagesToRender.push(1);
    if (startPage > 2) pagesToRender.push("...");
    for (let i = startPage; i <= endPage; i++) pagesToRender.push(i);
    if (endPage < totalPages - 1) pagesToRender.push("...");
    if (totalPages > 1) pagesToRender.push(totalPages);

    return pagesToRender.map((page, idx) =>
      page === "..." ? (
        <span key={`ellipsis-${idx}`} className="px-2 py-1 text-gray-400">...</span>
      ) : (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
            currentPage === page
              ? "bg-emerald-600 text-white shadow-md"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          {page}
        </button>
      )
    );
  };

  const navBtnClass = (disabled: boolean) =>
    `p-2 rounded-full transition-all duration-200 hover:bg-slate-300 hover:scale-105 active:scale-95 ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    }`;

  return (
    <div className=" min-h-[80vh] flex flex-col">
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-300 animate-pulse rounded" />
          ))}
        </div>
      )}

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!loading && !error && courses.length === 0 && (
        <p className="mb-4">Tidak ada kursus tersedia.</p>
      )}

      {!loading && !error && courses.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 w-full">
          {courses
            .sort((a, b) => b.total_reviewers - a.total_reviewers)
            .map((course) => (
              <Card
              key={course.course_id_int}
              onClick={() => router.push(`/course/${course.course_id_int}`)}
              className="group shadow-lg rounded-lg border hover:scale-[1.02] transition-transform duration-200 capitalize cursor-pointer w-full flex flex-col justify-between font-prettier"
              >
                <section>
                <CardHeader>
                  <CardTitle className="lg:text-lg md:text-md sm:text-md font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors capitalize">
          {course.name}
        </CardTitle>
                </CardHeader>
                </section>
                <section>
                <CardContent className="flex flex-col items-center gap-2 text-center">
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <RatingStars rating={course.average_rating} />
                    <span className="font-semibold text-yellow-600">
                      {course.average_rating.toFixed(1)}
                    </span>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                    <Users className="h-4 w-4 text-gray-950" />
                    <span>{formatTotalReviews(course.total_reviewers)} reviews</span>
                  </Badge>
                </CardContent>
                </section>
              </Card>
            ))}
        </div>
      )}

      <div className="flex justify-center items-center gap-1 mt-4 flex-wrap">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1 || loading}
          className={navBtnClass(currentPage === 1 || loading)}
        >
          <ChevronsLeft size={18} />
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className={navBtnClass(currentPage === 1 || loading)}
        >
          <ChevronLeft size={18} />
        </button>

        {renderPaginationButtons()}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className={navBtnClass(currentPage === totalPages || loading)}
        >
          <ChevronRight size={18} />
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages || loading}
          className={navBtnClass(currentPage === totalPages || loading)}
        >
          <ChevronsRight size={18} />
        </button>
      </div>
    </div>
  );
}
