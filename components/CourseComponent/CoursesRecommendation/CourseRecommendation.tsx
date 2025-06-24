import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RatingStars from "@/components/ui/ratingstars";  // Pastikan komponen RatingStars sudah ada
import {Users } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import {formatTotalReviews }from "@/components/ui/formatrevies";
import { useRouter } from "next/navigation";

export default function CourseRecommendation({
  course,
}: {
  course: { course_id_int:number; name: string; total_reviewers: number; average_rating: number; isTopRated?: boolean };
}) {
  const router = useRouter();  
  return (
    <Card className="cursor-pointer shadow-lg rounded-lg border hover:scale-105 transition-transform flex flex-col justify-between " onClick={()=> router.push(`/course/${course.course_id_int}`)}>
      <section>
      {/* Top Rated Label */}
      {course.isTopRated && (
        <div className="w-20 top-0 left-0 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-semibold px-2 py-1 rounded-br-lg">
          Top Rated
        </div>
      )}
      </section>
      <section>
      <CardHeader>
        <CardTitle>{course.name}</CardTitle>
      </CardHeader>
      </section>
      <CardContent className="flex flex-col items-center gap-2">
          <div className="text-gray-600 text-sm flex items-center gap-1">
            <RatingStars rating={course.average_rating} />
            <span className="font-semibold text-yellow-600">
              {course.average_rating.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{formatTotalReviews(course.total_reviewers)} reviewers</span>
            </Badge>
          </div>
        </CardContent>
    </Card>
  );
}
