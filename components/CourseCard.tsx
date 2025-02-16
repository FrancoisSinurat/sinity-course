"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function CourseList({
  courses,
  history,
}: {
  courses: { id: number; title: string; rating: number; num_enrolled_students: number; difficulty_level: string }[];
  history: { id: number; progress: number }[];
}) {
  const [selectedLevel, setSelectedLevel] = useState("All");

  const difficultyLevels = ["All", "Beginner", "Intermediate","Mixed", "Advanced"]
  const filteredCourses =
    selectedLevel === "All" ? courses : courses.filter(course => course.difficulty_level === selectedLevel);

  return (
    <div>
      {/* Dropdown Filter */}
      <div className="mb-4">
        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
          Filter by Difficulty
        </label>
        <select
          id="difficulty"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="mt-1 p-2 border rounded-md w-full"
        >
          {difficultyLevels.map(level => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      {/* List of Filtered Courses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {filteredCourses.map(course => {
          const takenCourse = history.find(h => h.id === course.id);
          return <CourseCard key={course.id} course={{ ...course, progress: takenCourse?.progress }} isTaken={!!takenCourse} />;
        })}
      </div>
    </div>
  );
}

export function CourseCard({
  course,
  isTaken,
}: {
  course: { title: string; rating: number; num_enrolled_students: number; difficulty_level: string; progress?: number };
  isTaken: boolean;
}) {
  const formatStudents = (num: number) => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num;
  };

  const difficultyColors: { [key: string]: string } = {
    "Beginner": "bg-green-300",
    "Intermediate": "bg-green-800",
    "Mixed": "bg-blue-800",
    "Advanced": "bg-red-500",
  };

  return (
    <Card className="shadow-lg rounded-lg border hover:scale-105">
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">{formatStudents(course.num_enrolled_students)}k Students</span>
          <Badge className={`${difficultyColors[course.difficulty_level] || "bg-gray-500"} text-white`}>
            {course.difficulty_level}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-yellow-500 text-lg">⭐ {course.rating}</span>
        </div>

        {/* Progress Bar hanya untuk kursus yang telah diambil */}
        {isTaken && course.progress !== undefined && (
          <div className="mt-3">
            <Progress value={course.progress} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">{course.progress}% completed</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

