import { useEffect, useState } from "react";
import { usePaginatedCourses } from "@/app/hooks/fetchAllCourses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RatingStars from "@/components/ui/ratingstars";
import { useRouter } from "next/navigation";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Users } from "lucide-react";
import { formatTotalReviews } from "@/components/ui/formatrevies";
import { Badge } from "@/components/ui/badge";

export default function AllCoursesList() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
  const router = useRouter();

  const { courses, loading, error, totalPages, fetchCoursesByPage } = usePaginatedCourses(apiUrl);
  const [currentPage, setCurrentPage] = useState(1);

  const [sortOption, setSortOption] = useState("reviewers"); // default: rating tertinggi

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
            currentPage === page ? "bg-emerald-600 text-white shadow-md" : "hover:bg-gray-100 text-gray-700"
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

  // Sort logic
  const sortedCourses = [...courses].sort((a, b) => {
    switch (sortOption) {
      case "rating":
        return b.average_rating - a.average_rating;
      case "reviewers":
        return b.total_reviewers - a.total_reviewers;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-[80vh] flex flex-col">
      <div className="bg-white p-4 rounded-sm">
      {/* Dropdown Filter */}
      <div className="flex justify-end items-center mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="font-medium text-sm text-gray-700">Urutkan:</label>
          <div className="relative w-48">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="reviewers">👥 Reviewer Terbanyak</option>
              <option value="rating">⭐ Rating Tertinggi</option>
              <option value="name-asc">🔤 Nama A - Z</option>
              <option value="name-desc">🔡 Nama Z - A</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
              <svg
                className="w-4 h-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>



      {/* Loading */}
      {loading && (
        <div className="grid lg:grid-cols-3 gap-6 mb-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-300 animate-pulse rounded" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Kosong */}
      {!loading && !error && sortedCourses.length === 0 && (
        <p className="mb-4">Tidak ada kursus tersedia.</p>
      )}

      {/* Card Kursus */}
      {!loading && !error && sortedCourses.length > 0 && (
        <div className="grid lg:grid-cols-3 gap-4 mb-4 w-full">
          {sortedCourses.map((course) => (
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

      {/* Pagination */}
      <div className="flex justify-center items-center gap-1 mt-4 flex-wrap mb-2">
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
    </div>
  );
}
