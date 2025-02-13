import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function CourseCard({ course }: { course: any }) {
  return (
    <Card className="shadow-lg rounded-lg border">
      <CardHeader>
        <CardTitle>{course.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">{course.category || "General"}</span>
          <Badge
            className={
              course.status === "Completed" ? "bg-green-500 text-white" : "bg-yellow-500 text-black"
            }
          >
            {course.status}
          </Badge>
        </div>
        <Progress value={course.progress} className="h-2" />
        <p className="text-xs text-gray-500 mt-1">{course.progress}% completed</p>
      </CardContent>
    </Card>
  );
}
