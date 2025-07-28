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
  return (
    <Card
      key={course.course_id_int}
      onClick={onClick}
      className="cursor-pointer shadow-lg rounded-lg border hover:scale-105 transition-transform"
    >
      <CardHeader>
        <CardTitle className="text-lg capitalize">{course.name}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-2 text-sm text-gray-700">
        <div className="text-gray-600 text-sm flex items-center gap-1">
          <RatingStars rating={course.average_rating} />
          <span className="font-semibold text-yellow-600">{course.average_rating.toFixed(1)}</span>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-black-500">
                {formatTotalReviews(course.total_reviewers)} reviews
            </span>
          </Badge>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEnroll(course.course_id_int);
          }}
          disabled={enrollingId === course.course_id_int || isEnrolled(course.course_id_int)}
          className={`bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 mt-2 w-full text-center ${
            enrollingId === course.course_id_int || isEnrolled(course.course_id_int)
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {isEnrolled(course.course_id_int)
            ? "Sudah Terdaftar"
            : enrollingId === course.course_id_int
            ? "Mendaftar..."
            : "Enroll"}
        </button>
      </CardContent>
    </Card>
  );
}
