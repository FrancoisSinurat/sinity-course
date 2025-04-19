"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RatingStars from "@/components/ui/ratingstars";
import { getToken } from "@/lib/auth";

interface CourseRecommendation {
  course_id: string;
  name: string;
  total_reviews: number;
  average_rating: number;
}

function formatTotalReviews(totalreviews: number): string {
  return totalreviews >= 1000 ? `${(totalreviews / 1000).toFixed(1)}k` : totalreviews.toString();
}

export default function RecommendedUser() {
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      const token = getToken();
      if (!token) {
        setError("Kamu belum login.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/recommend_for_user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Gagal mengambil rekomendasi: ${res.statusText}`);
        const data = await res.json();
        setRecommendations(data.recommendations || []);
      } catch (err) {
        console.error("Error fetching user recommendations:", err);
        setError("Terjadi kesalahan saat mengambil rekomendasi.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const chunkedRecommendations = [];
  for (let i = 0; i < recommendations.length; i += 5) {
    chunkedRecommendations.push(recommendations.slice(i, i + 5));
  }

  return (
    <div className="w-full p-4 bg-white shadow-lg rounded-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold">Rekomendasi Untuk Kamu</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-gray-500 text-center">Memuat rekomendasi...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-6">
            {chunkedRecommendations.map((group, index) => (
              <div key={index} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
                {group.map((course) => (
                  <Card
                    key={course.course_id}
                    className="p-3 border shadow-md text-center text-sm hover:shadow-lg transition hover:scale-105"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md font-inter capitalize">
                        {course.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                      <div className="text-gray-600 text-sm flex items-center gap-1">
                        <RatingStars rating={course.average_rating} />
                        <span className="font-semibold text-yellow-600">
                          {course.average_rating.toFixed(1)}
                        </span>
                        ({formatTotalReviews(course.total_reviews)} Reviews)
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">Tidak ada rekomendasi saat ini.</p>
        )}
      </CardContent>
    </div>
  );
}
