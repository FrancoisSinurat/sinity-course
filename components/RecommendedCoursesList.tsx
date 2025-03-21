"use client";

import CourseRecommendation from "@/components/CourseRecommendation";

export default function RecommendedCoursesList({
  recommendations,
}: {
  recommendations: { course_id: string; name: string; similarity: number }[];
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold mt-4">Rekomendasi Kursus</h2>
      {recommendations.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 capitalize ">
          {recommendations.map((course) => (
            <CourseRecommendation key={course.course_id} course={course} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No recommendations available.</p>
      )}
    </div>
  );
}
