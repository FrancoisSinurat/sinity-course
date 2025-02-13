import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RecommendedCourses({ courses }: { courses: any[] }) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Recommended Courses</CardTitle>
      </CardHeader>
      <CardContent>
        {courses.length > 0 ? (
          <ul className="space-y-2">
            {courses.map((course) => (
              <li key={course.id} className="flex justify-between">
                <span>{course.name}</span>
                <Button asChild variant="outline">
                  <Link href={`/courses/${course.id}`}>View</Link>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recommendations available.</p>
        )}
      </CardContent>
    </Card>
  );
}
