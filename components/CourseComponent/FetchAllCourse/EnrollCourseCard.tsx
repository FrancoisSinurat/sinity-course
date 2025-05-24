"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import RatingStars from "@/components/ui/ratingstars";
import { Clock } from "lucide-react";

type EnrolledCourse = {
  course_id_int: number;
  name: string;
  average_rating: number;
  total_reviewers: number;
  enrolled_at?: string; // opsional, kalau ada
};

type Props = {
  course: EnrolledCourse;
  onClick?: () => void;
};

function formatReviewers(n: number): string {
  return n > 1000 ? `${(n / 1000).toFixed(1)}k+` : `${n}`;
}

export default function EnrolledCourseCard({ course, onClick }: Props) {
  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200"
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg font-semibold text-neutral-800 group-hover:text-blue-600 transition-colors capitalize">
          {course.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="text-sm pt-2 text-muted-foreground space-y-2">
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <div className="flex items-center gap-1">
            <RatingStars rating={course.average_rating} />
            <span className="text-yellow-600 font-medium">
              {course.average_rating.toFixed(1)}
            </span>
          </div>

          <Badge variant="secondary" className="flex items-center gap-1 text-xs w-fit">
            <Users className="h-4 w-4 text-gray-500" />
            {formatReviewers(course.total_reviewers)} reviewers
          </Badge>
        </div>
      </CardContent>


      <CardFooter className=" text-xs text-gray-400 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        <span>
          Diakses terakhir:{" "}
          {course.enrolled_at ? new Date(course.enrolled_at).toLocaleDateString() : "Tidak tersedia"}
        </span>
      </CardFooter>
    </Card>
  );
}
