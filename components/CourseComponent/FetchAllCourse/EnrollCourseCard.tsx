"use client";

import {
  Card,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Users, Clock, CheckCircle } from "lucide-react";
import RatingStars from "@/components/ui/ratingstars";

type EnrolledCourse = {
  course_id_int: number;
  name: string;
  average_rating: number;
  total_reviewers: number;
  enrolled_at?: string;
};

type Props = {
  course: EnrolledCourse;
  isCompleted?: boolean;
  onClick?: () => void;
};

function formatReviewers(n: number): string {
  return n > 1000 ? `${(n / 1000).toFixed(1)}k+` : `${n}`;
}

export default function EnrolledCourseCard({
  course,
  isCompleted = false,
  onClick,
}: Props) {
  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 rounded-2xl p-4 flex flex-col justify-between"
    >
        
      <section className="flex flex-row items-start justify-between gap-4">
        <CardTitle className="lg:text-lg md:text-md sm:text-md font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors capitalize">
          {course.name}
        </CardTitle>

        {isCompleted && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">
            <CheckCircle className="w-4 h-4" />
            Selesai
          </span>
        )}
      </section>
      <section>
        
      <CardContent className="mt-4 space-y-2 text-sm text-muted-foreground">
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <div className="flex items-center gap-1">
            <RatingStars rating={course.average_rating} />
            <span className="text-yellow-600 font-medium">
              {course.average_rating.toFixed(1)}
            </span>
          </div>

          <div className="inline-flex items-center gap-1 text-xs text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
            <Users className="h-4 w-4 text-gray-500" />
            {formatReviewers(course.total_reviewers)} reviewers
          </div>
        </div>
      </CardContent>

      <CardFooter className=" text-xs text-gray-500 flex items-center justify-center gap-2 font-medium">
        <Clock className="w-4 h-4 text-gray-400" />
        <span>
          Diakses terakhir:{" "}
          {course.enrolled_at
            ? new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date(course.enrolled_at))
            : "Tidak tersedia"}
        </span>
      </CardFooter>
      </section>
    </Card>
  );
}
