"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import clsx from "clsx"; // Pastikan sudah diinstall: npm install clsx
import Link from "next/link";
import { Briefcase } from "lucide-react"; 

interface Course {
  id: number;
  title: string;
  rating: number;
  num_enrolled_students: number;
  difficulty_level: string;
}

// Urutan level kesulitan dari dasar hingga professional
const difficultyOrder = [
  "Dasar",
  "Pemula",
  "Dasar-Pemula",
  "Pemula-Menengah",
  "Menengah",
  "Mahir",
  "Mahir-Profesional",
  "Profesional",
];

// Komponen Button untuk Filter
function FilterButton({ level, active, onClick }: { level: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-4 py-2 text-sm rounded-full transition-all",
        active ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-slate-600"
      )}
    >
      {level}
    </button>
  );
}

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>("All");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/courses");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Tambahkan ID otomatis dan urutkan berdasarkan level kesulitan
        const coursesWithId = data
          .map((course: Omit<Course, "id">, index: number) => ({
            ...course,
            id: index + 1,
          }))
          .sort((a: Course, b: Course) => 
            difficultyOrder.indexOf(a.difficulty_level) - difficultyOrder.indexOf(b.difficulty_level)
          );

        setCourses(coursesWithId);
      } catch (err) {
        setError("Gagal memuat kursus. Silakan coba lagi.");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Menggunakan useMemo agar filtering lebih efisien
  const filteredCourses = useMemo(() => {
    return selectedLevel === "All"
      ? courses
      : courses.filter((course) => course.difficulty_level === selectedLevel);
  }, [selectedLevel, courses]);

  return (
    <div className="px-8 pt-20 flex flex-col w-full min-h-screen">
      <div className="mb-4">
      <Card className="w-full max-w-sm p-4 shadow-md">
      <CardHeader className="flex flex-row items-center gap-3">
        <Briefcase className="w-8 h-8 text-red-600" />
        <CardTitle>Skill Assessment</CardTitle>
      </CardHeader>
      <CardContent>
      <p className="text-gray-600">
          Complete your profile based on your expertise to receive more relevant course recommendations.
        </p>
        <div className="mt-4">
          <Button asChild className="w-full bg-red-600 text-white hover:bg-red-700">
            <Link href="/user-pref">Update Your Profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <FilterButton level="All" active={selectedLevel === "All"} onClick={() => setSelectedLevel("All")} />
        {difficultyOrder.map((level) => (
          <FilterButton key={level} level={level} active={selectedLevel === level} onClick={() => setSelectedLevel(level)} />
        ))}
      </div>

      {/* Status & Error Handling */}
      {loading && <p className="text-gray-500">Loading kursus...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Daftar Kursus */}
      {!loading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => <CourseCard key={course.id} course={course} />)
          ) : (
            <p className="text-gray-500">Tidak ada kursus yang tersedia untuk level ini.</p>
          )}
        </div>
      )}
    </div>

  );
}
