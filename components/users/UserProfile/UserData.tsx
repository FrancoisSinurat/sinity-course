"use client";

import { useEffect, useState } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import RatingStars from "@/components/ui/ratingstars";
import { useAuthStore } from "@/app/store/AuthStore";
import { motion, AnimatePresence } from "framer-motion";

interface RatedCourse {
  course_id_int: number;
  name: string;
  rating: number;
}

interface UserProfileResponse {
  user_id: number;
  rated_courses?: RatedCourse[];
  total_pages: number;
  total_count: number;
}

export default function UserData() {
  const ModelUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = useAuthStore((state) => state.token);
  const [data, setData] = useState<UserProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 5;
  const hasRatedCourses = !!data?.rated_courses && data.rated_courses.length > 0;

  useEffect(() => {
    if (!token) {
      setError("Token tidak ditemukan. Harap login.");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`${ModelUrl}/users?page=${page}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json: UserProfileResponse = await res.json();
        setData(json);
      } catch (err) {
        console.error("Gagal mengambil data user:", err);
        setError("Gagal memuat data user. Silakan coba lagi.");
      }
    };

    fetchData();
  }, [ModelUrl, token, page]);

  const handlePageChange = (newPage: number) => {
    if (data?.total_pages && newPage >= 1 && newPage <= data.total_pages) {
      setPage(newPage);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;


  return (
    <>
      {hasRatedCourses && (
        <section className="mt-6 p-4 ">
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">
            Review Terbaru Anda
          </h2>

          <AnimatePresence mode="wait">
                    <motion.div
                      key={page}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="grid md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                      {data.rated_courses?.map((course) => (
                        <Card
                          key={course.course_id_int}
                          className="shadow-lg rounded-lg border h-full flex flex-col justify-between"
                        >
                          <CardHeader className="p-4 text-center">
                            <CardTitle className="text-lg capitalize">
                              {course.name}
                            </CardTitle>
                          </CardHeader>
                          <CardFooter className="mt-auto p-4 justify-center">
                            <div className="flex items-center space-x-2 text-sm text-gray-700">
                              <RatingStars rating={course.rating} />
                              <span className="text-yellow-600 font-semibold">
                                {course.rating.toFixed(1)}
                              </span>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </motion.div>
          </AnimatePresence>

          {data?.total_pages > 1 && (
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

              {Array.from({ length: data.total_pages }, (_, i) => i + 1).map((p) => (
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
                disabled={page === data.total_pages}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  page === data.total_pages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border shadow-sm hover:bg-gray-100"
                }`}
              >
                Next ➡
              </button>
            </div>
          )}
        </section>
      )}
    </>
  );
}
