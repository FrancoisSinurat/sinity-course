import { useState } from "react";

export function CourseList({ courses }: { courses: { id: number; title: string; rating: number; num_enrolled_students: number; difficulty_level: string }[] }) {
  const [selectedLevel, setSelectedLevel] = useState("All");

  const difficultyLevels = ["All", "Dasar", "Pemula", "Dasar-Pemula", "Pemula-Menengah", "Menengah", "Mahir", "Mahir-Professional", "Professional"];

  const filteredCourses = selectedLevel === "All" ? courses : courses.filter(course => course.difficulty_level === selectedLevel);

  return (
    <div>
      {/* Dropdown Filter */}
      <div className="mb-4">
        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">Filter by Difficulty</label>
        <select
          id="difficulty"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="mt-1 p-2 border rounded-md w-full"
        >
          {difficultyLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      {/* List of Filtered Courses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

export function CourseCard({ 
  course,
}: {
  course: { title: string; rating: number; num_enrolled_students: number; difficulty_level: string };
}) {
  const formatStudents = (num: number) => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num;
  };

  // Warna berdasarkan level kesulitan
  const difficultyColors: { [key: string]: string } = {
    "Dasar": "bg-green-300",
    "Dasar-Pemula": "bg-green-500",
    "Pemula": "bg-green-800",
    "Pemula-Menengah": "bg-blue-400",
    "Menengah": "bg-blue-800",
    "Mahir": "bg-red-500",
    "Mahir-Profesional": "bg-red-700",
    "Profesional": "bg-red-800",
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 cursor-pointer">
      <h3 className="text-xl font-semibold text-gray-800 truncate">{course.title}</h3>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-yellow-500 text-lg">⭐ {course.rating}</span>
        <span className="text-gray-500 text-sm">({formatStudents(course.num_enrolled_students)} Students)</span>
      </div>
      <span
        className={`mt-3 inline-block px-3 py-1 text-sm font-medium rounded-full text-white ${difficultyColors[course.difficulty_level] || "bg-gray-500"}`}
      >
        {course.difficulty_level}
      </span>
    </div>
  );
}
