"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import CourseCard from "@/components/CourseComponent/FetchAllCourse/CourseCard";
import { useCourseRecommendation, useUser } from "@/app/hooks/useCourseRecommendation";
import { formatTotalReviews } from "@/components/ui/formatrevies";
import { showSuccess, showError } from "@/lib/alert";
import RecommendModal, { RecommendationCourse } from "@/components/users/recommend/RecommendModal";

export default function RecommendByCoursePage() {
  const { course_id } = useParams();
  const router = useRouter();
  const { basedOnCourse, recommendedCourses, loading, error } = useCourseRecommendation(course_id);
  const { user, setUser, token } = useUser();
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [completedCourses, setCompletedCourses] = useState<number[]>([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [courseToRate, setCourseToRate] = useState<number | null>(null);

  // state untuk modal rekomendasi
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationCourse[]>([]);

  const isEnrolled = (id: number) => user?.enrolled_courses.includes(id) ?? false;
  const isCompleted = (id: number) => completedCourses.includes(id);

  interface CompletedCourse {
    course_id_int: number;
  }

  useEffect(() => {
    const fetchCompletedCourses = async () => {
      if (!user) return;

      try {
        const res = await fetch(`${apiUrl}/complete-course`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Gagal ambil data kursus selesai");

        const data = await res.json();
        const ids = data.completed_courses.map((c: CompletedCourse) => c.course_id_int);
        setCompletedCourses(ids);
      } catch (err) {
        console.error("Error fetch completed courses:", err);
      }
    };

    fetchCompletedCourses();
  }, [user, apiUrl, token]);



  const handleEnroll = async (course_id: number) => {
    if (!user) {
      router.push(`/login?redirect=/course/${course_id}`);
      return;
    }

    const confirm = await Swal.fire({
      title: `Enroll kursus ${basedOnCourse?.name.toUpperCase()}?`,
      text: "Kamu yakin ingin mendaftar ke kursus ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Daftar",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

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
        const err = await res.json();
        throw new Error(err.detail || "Gagal mendaftar kursus.");
      }

      const data = await res.json();
      showSuccess(data.message);

      setUser((prev) =>
        prev ? { ...prev, enrolled_courses: [...prev.enrolled_courses, course_id] } : prev
      );

      router.push(`/course/${course_id}`);
    } catch (err) {
      showError((err as Error).message || "Terjadi kesalahan saat mendaftar kursus.");
    } finally {
      setEnrollingId(null);
    }
  };

  const handleCompleteCourse = async (course_id: number) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const confirm = await Swal.fire({
      title: `Tandai kursus ${basedOnCourse?.name.toUpperCase()} sebagai selesai?`,
      text: "Pastikan kamu telah menyelesaikan materi kursus ini.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Selesai",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${apiUrl}/complete-course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course_id_int: course_id }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Gagal menyelesaikan kursus.");
      }

      const data = await res.json();
      showSuccess(data.message);

      setCompletedCourses((prev) => [...prev, course_id]);
      setUser((prev) =>
        prev
          ? { ...prev, completed_courses: [...(prev.completed_courses ?? []), course_id] }
          : prev
      );

      setCourseToRate(course_id);
      setShowRatingModal(true);
    } catch (err) {
      showError((err as Error).message || "Terjadi kesalahan saat menyelesaikan kursus.");
    }
  };

  const handleSubmitRating = async () => {
    if (!user || !courseToRate || rating === 0) return;

    try {
      const res = await fetch(`${apiUrl}/rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course_id_int: courseToRate,
          rating,
          review: reviewText,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Gagal mengirim rating.");
      }

      showSuccess("Rating berhasil dikirim!");

      // 🔹 Ambil rekomendasi langsung setelah rating
      const recRes = await fetch(`${apiUrl}/recommend_for_user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const recJson = await recRes.json();
      setRecommendations(recJson?.data?.recommendations || []);
      setShowRecommendModal(true);
    } catch (err) {
      showError((err as Error).message);
    } finally {
      setShowRatingModal(false);
      setRating(0);
      setReviewText("");
      setCourseToRate(null);
    }
  };

  return (
    <div className="px-8 pt-24 flex flex-col w-full min-h-screen space-y-8">
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
      >
        ⬅ Kembali ke Beranda
      </button>

      {/* Section utama course */}
      {basedOnCourse && (
        <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold capitalize mb-2">{basedOnCourse.name}</h2>
          <div className="flex items-center gap-4 mb-4">
            <span className="font-semibold text-yellow-600 flex items-center gap-1">
              <span>⭐</span> {basedOnCourse.average_rating.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">
              {formatTotalReviews(basedOnCourse.total_reviewers)} reviewers
            </span>
          </div>

          {/* Button Enroll */}
          <button
              onClick={() => {
                if (basedOnCourse.course_url) {
                  window.open(basedOnCourse.course_url, "_blank");
                }

                handleEnroll(basedOnCourse.course_id_int);
              }}

            disabled={
              enrollingId === basedOnCourse.course_id_int ||
              isEnrolled(basedOnCourse.course_id_int) ||
              isCompleted(basedOnCourse.course_id_int)
            }
            className={`bg-blue-600 hover:bg-blue-700 text-white rounded px-6 py-2 font-semibold transition ${
              enrollingId === basedOnCourse.course_id_int ||
              isEnrolled(basedOnCourse.course_id_int) ||
              isCompleted(basedOnCourse.course_id_int)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isCompleted(basedOnCourse.course_id_int)
              ? "Kursus Selesai"
              : isEnrolled(basedOnCourse.course_id_int)
              ? "Sudah Terdaftar"
              : enrollingId === basedOnCourse.course_id_int
              ? "Mendaftar..."
              : "Enroll Kursus Ini"}
          </button>

          {isEnrolled(basedOnCourse.course_id_int) && (
            <button
              onClick={() => handleCompleteCourse(basedOnCourse.course_id_int)}
              disabled={isCompleted(basedOnCourse.course_id_int)}
              className={`mx-4 bg-green-600 hover:bg-green-700 text-white rounded px-6 py-2 font-semibold transition ${
                isCompleted(basedOnCourse.course_id_int) ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isCompleted(basedOnCourse.course_id_int) ? "Selesai" : "Tandai Selesai"}
            </button>
          )}
        </div>
      )}

      <h1 className="text-xl font-bold">
        Kursus Serupa - <span className="text-blue-500 capitalize">{basedOnCourse?.name}</span>
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-300 animate-pulse rounded" />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : recommendedCourses.length === 0 ? (
        <p className="text-gray-600">Tidak ada rekomendasi ditemukan.</p>
      ) : (
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

      {showRatingModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-[500px] max-w-[90%] shadow-2xl space-y-6 transition-all">
            <h2 className="text-2xl font-semibold text-gray-800">Beri Rating Kursus</h2>

            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-3xl cursor-pointer transition ${
                    star <= rating ? "text-yellow-500 scale-110" : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                onClick={() => setShowRatingModal(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
                onClick={handleSubmitRating}
                disabled={rating === 0}
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Modal Rekomendasi */}
      <RecommendModal
        open={showRecommendModal}
        onClose={() => setShowRecommendModal(false)}
        recommendations={recommendations}
      />
    </div>
  );
}
