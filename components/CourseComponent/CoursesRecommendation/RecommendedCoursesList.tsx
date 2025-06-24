"use client";

import { CourseRecommendationType } from "@/app/hooks/useCourseSearch";
import CourseRecommendation from "@/components/CourseComponent/CoursesRecommendation/CourseRecommendation";

export default function RecommendedCoursesList({
  recommendations,
  userInput,
}: {
  recommendations: CourseRecommendationType[];
  userInput: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold mt-4">
        Hasil rekomendasi berdasarkan: <span className="text-blue-500 capitalize">{userInput}</span>
      </h2>
      {recommendations.length > 0 ? (
        <div className="mt-4 grid grid-cols-2  md:grid-cols-3 lg:grid-cols-5 gap-4 capitalize ">
                  {[...recommendations]
          .sort((a, b) => b.total_reviewers - a.total_reviewers)
          .map((course) => (
            <CourseRecommendation  key={course.course_id_int} course={course} />
        ))}
        </div>
      ) : (
        <div className="text-gray-500">No recommendations available.</div>
      )}
    </div>
  );
}
