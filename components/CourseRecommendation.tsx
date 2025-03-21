"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CourseRecommendation({
  course,
}: {
  course: { name: string; similarity: number };
}) {
  return (
    <Card className="shadow-lg rounded-lg border hover:scale-105 transition-transform">
      <CardHeader>
        <CardTitle>{course.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600">
          Similarity: {course.similarity.toFixed(2)}
        </div>
      </CardContent>
    </Card>
  );
}
