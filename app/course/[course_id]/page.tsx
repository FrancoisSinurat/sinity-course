"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import CourseCard from "@/components/CourseComponent/FetchAllCourse/CourseCard";
import { useCourseRecommendation, useUser } from "@/app/hooks/useCourseRecommendation";
import { formatTotalReviews } from "@/components/ui/formatrevies";
import { showSuccess, showError } from "@/lib/alert";
import {useUnsplashImage} from "@/app/hooks/unsplashImage";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function RecommendByCoursePage() {
  const { course_id } = useParams();
  const router = useRouter();
  const { basedOnCourse, recommendedCourses, loading, error } = useCourseRecommendation(course_id);
  const { user, setUser, token } = useUser();
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const isEnrolled = (id: number) => user?.enrolled_courses.includes(id) ?? false;
  const [completedCourses, setCompletedCourses] = useState<number[]>([]);
  // cek course sudah selesai
  const isCompleted = (id: number) => completedCourses.includes(id);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [courseToRate, setCourseToRate] = useState<number | null>(null);
  const imageUrl = useUnsplashImage(basedOnCourse?.name || "online course");


interface CompletedCourse {
  course_id_int: number;
}

  useEffect(() => {
    const fetchCompletedCourses = async () => {
      if (!user) return;

      try {
        const res = await fetch(`${apiUrl}/complete-course`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      title: `Ikuti kursus ${basedOnCourse?.name}?`,
      text: "Kamu yakin ingin mendaftar ke kursus ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Daftar",
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

// setelah berhasil tandai selesai, update state completedCourses dan user
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

    setCompletedCourses(prev => [...prev, course_id]);
    setUser(prev => prev ? {...prev, completed_courses: [...(prev.completed_courses ?? []), course_id]} : prev);
  
    // munculkan modal rating
    setCourseToRate(course_id);
    setShowRatingModal(true);
  } catch (err) {
    showError((err as Error).message || "Terjadi kesalahan saat menyelesaikan kursus.");
  }
};

const handleSubmitRating = async () => {
  if (!user || !courseToRate) return;

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

    const data = await res.json();
    showSuccess(data.message || "Rating berhasil dikirim!");
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
{basedOnCourse && (
  <Card className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl border shadow">
    
    {/* Kiri: Gambar */}
    {imageUrl && (
      <div className="w-full md:w-80 flex-shrink-0">
        <Image
          src={imageUrl}
          alt={basedOnCourse.name}
          className="w-full h-48 md:h-60 object-cover rounded-xl"
          width={320}
          height={240}
        />
      </div>
    )}

    {/* Kanan: Content */}
    <div className="flex flex-col flex-1 justify-between space-y-4">
      <CardHeader>
        <CardTitle className="text-2xl capitalize">{basedOnCourse.name}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <span className="font-semibold text-yellow-600 flex items-center gap-1 text-lg">
            ⭐ {basedOnCourse.average_rating.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            {formatTotalReviews(basedOnCourse.total_reviewers)} reviews
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-3">
        <button
          onClick={() => handleEnroll(basedOnCourse.course_id_int)}
          disabled={
            enrollingId === basedOnCourse.course_id_int ||
            isEnrolled(basedOnCourse.course_id_int) ||
            isCompleted(basedOnCourse.course_id_int)
          }
          className={`bg-blue-600 hover:bg-blue-700 text-white rounded px-6 py-2 font-semibold transition ${
            enrollingId === basedOnCourse.course_id_int || isEnrolled(basedOnCourse.course_id_int) || isCompleted(basedOnCourse.course_id_int)
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
            : "Enroll"}
        </button>

        {isEnrolled(basedOnCourse.course_id_int) && (
          <button
            onClick={() => handleCompleteCourse(basedOnCourse.course_id_int)}
            disabled={isCompleted(basedOnCourse.course_id_int)}
            className={`bg-green-600 hover:bg-green-700 text-white rounded px-6 py-2 font-semibold transition ${
              isCompleted(basedOnCourse.course_id_int) ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isCompleted(basedOnCourse.course_id_int) ? "Selesai" : "Tandai Selesai"}
          </button>
        )}
      </CardFooter>
    </div>
  </Card>
)}



      <h1 className="text-xl font-bold">
        Kursus Serupa -{" "}
        <span className="text-blue-500 capitalize">
          {basedOnCourse?.name || course_id}
        </span>
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
          {recommendedCourses.sort((a, b) => b.total_reviewers - a.total_reviewers).map((course) => (
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-96 shadow-xl space-y-4">
              <h2 className="text-lg font-bold">Beri Rating Kursus</h2>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-2xl cursor-pointer ${star <= rating ? "text-yellow-500" : "text-gray-400"}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  onClick={() => setShowRatingModal(false)}
                >
                  Batal
                </button>
                <button
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleSubmitRating}
                  disabled={rating === 0}
                >
                  Kirim
                </button>
              </div>
            </div>
          </div>
        )}

    </div>
  );
}
