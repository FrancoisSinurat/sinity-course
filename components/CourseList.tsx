"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CourseList({
  courses,
}: {
  courses: { course_id: string; name: string }[];
}) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.length > 0 ? (
          courses.map((course) => (
            <Card
              key={course.course_id}
              className="shadow-lg rounded-lg border hover:scale-105 transition-transform capitalize"
            >
              <CardHeader>
                <CardTitle>{course.name}</CardTitle>
              </CardHeader>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No courses available.</p>
        )}
      </div>
    </div>
  );
}
