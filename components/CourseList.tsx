"use client";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star,   MessageCircle } from "lucide-react";

const RatingStars = ({ average_rating }: { average_rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => {
        const isFilled = index < Math.floor(average_rating); // Bintang penuh
        const isHalf = index === Math.floor(average_rating) && average_rating % 1 >= 0.5; // Setengah bintang

        return (
          <div key={index} className="relative w-5 h-5">
            {/* Bintang kosong sebagai outline */}
            <Star className="absolute w-5 h-5 text-yellow-500" />
            
            {/* Bintang penuh jika rating cukup */}
            {isFilled && <Star className="absolute w-5 h-5 text-yellow-500 fill-yellow-500" />}
            
            {/* Setengah bintang dengan clip-path */}
            {isHalf && (
              <div className="absolute w-5 h-5 overflow-hidden">
                <Star className="absolute w-5 h-5 text-yellow-500 fill-yellow-500" style={{ clipPath: "inset(0 50% 0 0)" }} />
              </div>
            )}
          </div>
        );
      })}
      <div className="text-sm font-medium text-yellow-500">{average_rating.toFixed(1)}</div>
    </div>
  );
};

interface Course {
  course_id: string;
  name: string;
  total_reviewers: number;
  average_rating: number;
}

function formatReviews(reviews: number): string {
  return reviews >= 1000 ? `${(reviews / 1000).toFixed(1)}k` : reviews.toString();
}

export default function CourseList({ courses }: { courses: Course[] }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.length > 0 ? (
        courses.map((course) => (
          <Card
            key={course.course_id}
            className="shadow-md rounded-lg border border-gray-200 hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold capitalize">{course.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-gray-600">
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <div className="text-sm">{formatReviews(course.total_reviewers)} Reviews</div>
              </div>
              <RatingStars average_rating={course.average_rating} />
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-gray-500 text-center col-span-full">No courses available.</div>
      )}
    </div>
    </>
  );
}
