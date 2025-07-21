"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import RatingStars from "@/components/ui/ratingstars";
import { formatTotalReviews } from "@/components/ui/formatrevies";

type Course = {
  course_id_int: number;
  name: string;
  average_rating: number;
  total_reviewers: number;
};

type Props = {
  course: Course;
  onEnroll: (id: number) => void;
  isEnrolled: (id: number) => boolean;
  enrollingId: number | null;
  onClick?: () => void;
};

export default function CourseCard({
  course,
  onEnroll,
  isEnrolled,
  enrollingId,
  onClick,
}: Props) {
  const isLoading = enrollingId === course.course_id_int;
  const enrolled = isEnrolled(course.course_id_int);

  return (
    <Card
      key={course.course_id_int}
      onClick={onClick}
      className="group cursor-pointer shadow-md rounded-xl border hover:shadow-lg hover:scale-[1.02] transition-transform duration-200 bg-white flex flex-col justify-between h-full"
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-row">
            <RatingStars rating={course.average_rating} />
            <span className="text-sm font-semibold text-yellow-600 ml-1">
              {course.average_rating.toFixed(1)}
            </span>
          </div>

          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">{formatTotalReviews(course.total_reviewers)}</span>
          </Badge>
        </div>

        <CardTitle className="text-lg font-semibold text-gray-800 mt-3 capitalize">
          {course.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="mt-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEnroll(course.course_id_int);
          }}
          disabled={isLoading || enrolled}
          className={`w-full py-2 rounded-md text-sm font-semibold transition ${
            enrolled
              ? "bg-gray-200 text-gray-600 cursor-not-allowed"
              : isLoading
              ? "bg-blue-400 text-white cursor-wait"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {enrolled ? "Sudah Terdaftar" : isLoading ? "Mendaftar..." : "Enroll"}
        </button>
      </CardContent>
    </Card>
  );
}
