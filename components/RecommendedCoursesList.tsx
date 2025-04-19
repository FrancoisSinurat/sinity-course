"use client";

import CourseRecommendation from "@/components/CourseRecommendation";

export default function RecommendedCoursesList({
  recommendations,
  userInput,
}: {
  recommendations: { course_id: string; name: string; similarity: number }[];
  userInput: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold mt-4">
        Hasil rekomendasi berdasarkan: <span className="text-blue-500 capitalize">{userInput}</span>
      </h2>
      {recommendations.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 capitalize ">
          {recommendations.map((course) => (
            <CourseRecommendation key={course.course_id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No recommendations available.</div>
      )}
    </div>
  );
}
