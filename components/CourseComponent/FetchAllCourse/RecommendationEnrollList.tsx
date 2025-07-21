"use client";

import { useEnrollRecommendation } from "@/app/hooks/useRecommendEnroll";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import RatingStars from "@/components/ui/ratingstars";
import { formatTotalReviews } from "@/components/ui/formatrevies";
import { Badge } from "@/components/ui/badge";


export default function EnrollRecommendationsList() {
  const { recommendedCourses, loading, error } = useEnrollRecommendation();
  const router = useRouter();
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!recommendedCourses.length) {
    return <p className="text-muted-foreground">Belum ada rekomendasi berdasarkan course lo.</p>;
  }

  return (
    <div className="mb-4 p-6 rounded-sm bg-white">
      <div >
      <h2 className="text-lg font-semibold mb-4">Berdasarkan Riwayat Anda...</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 mt-4 w-full">
            {recommendedCourses
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
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{formatTotalReviews(course.total_reviewers)} Pengguna</span>
                    </Badge>
                  </CardContent>
                  </section>
                </Card>
              ))}
      </div> 
    </div>
  );
}
