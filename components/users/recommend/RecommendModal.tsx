"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RatingStars from "@/components/ui/ratingstars";
import { Users } from "lucide-react";
import { formatTotalReviews } from "@/components/ui/formatrevies";
import { useRouter } from "next/navigation";

export interface RecommendationCourse {
  course_id_int: number;
  name: string;
  total_reviewers: number;
  average_rating: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  recommendations: RecommendationCourse[];
}

export default function RecommendModal({ open, onClose, recommendations }: Props) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Pengguna lain mengikuti...</DialogTitle>
        </DialogHeader>

        {recommendations.length ? (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {recommendations.map((course) => (
              <Card
                key={course.course_id_int}
                className="flex flex-col justify-between h-full border hover:border-blue-300 hover:shadow-lg cursor-pointer transition"
                onClick={() => router.push(`/course/${course.course_id_int}`)}
              >
                <CardHeader className="text-center">
                  <CardTitle className="text-sm capitalize">{course.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center gap-2">
                    <RatingStars rating={course.average_rating} />
                    <div className="text-yellow-600 font-bold text-xs">
                      {course.average_rating.toFixed(1)} / 5
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center pb-3">
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{formatTotalReviews(course.total_reviewers)} reviewers</span>
                  </Badge>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm">Tidak ada rekomendasi.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
