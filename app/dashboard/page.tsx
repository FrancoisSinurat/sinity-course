'use client';
import { useEffect, useState, useCallback, useRef } from "react";
import { FaFilter } from "react-icons/fa";
import { MdOutlineArrowDropDown } from "react-icons/md";
import UserPreference from "@/components/UserPreference";
import CourseList from "@/components/CourseList";
import RecommendedCoursesList from "@/components/RecommendedCoursesList";
import HybridRecommendations from "@/components/HybridRecommendation";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

interface Course {
  course_id: string;
  name: string;
  total_reviewers: number;
  average_rating: number;
}

interface CourseRecommendation {
  course_id: string;
  name: string;
  similarity: number;
}

interface LoggedInUser {
  user_id: number;
  name: string;
  email: string;
}

export default function DashboardPage() {
  const ModelUrl = process.env.NEXT_PUBLIC_API_URL;
  const [query, setQuery] = useState("");
  const [courseRecommendations, setCourseRecommendation] = useState<CourseRecommendation[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingCourseRecommendations, setLoadingCourseRecommendations] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState<"reviews" | "rating">("reviews");
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<LoggedInUser | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();

  // Cek token & validasi user
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${ModelUrl}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUser(data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });
  }, []);

  // Ambil daftar semua kursus
  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const res = await fetch(`${ModelUrl}/courses`);
        if (!res.ok) throw new Error("Gagal mengambil kursus");
        const data = await res.json();
        setCourses(data.courses || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Gagal mengambil daftar kursus.");
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  // Rekomendasi search course berdasarkan input user
  const fetchCourseRecommendation = useCallback(async () => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length === 0) {
      setError("");
      setCourseRecommendation([]);
      return;
    }

    const words = trimmedQuery.split(/\s+/);
    if (words.length < 2) {
      setError("Masukkan minimal dua kata. Contoh: 'data science', 'machine learning'.");
      setCourseRecommendation([]);
      return;
    }

    setLoadingCourseRecommendations(true);
    setError("");

    try {
      const res = await fetch(`${ModelUrl}/recommend_course?course_name=${encodeURIComponent(trimmedQuery)}`);
      if (!res.ok) throw new Error(`Gagal mengambil rekomendasi`);
      const data = await res.json();
      setCourseRecommendation(data.recommendations || []);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Terjadi kesalahan saat mengambil data rekomendasi.");
    } finally {
      setLoadingCourseRecommendations(false);
    }
  }, [query]);

  // Trigger rekomendasi saat query berubah
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCourseRecommendation();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [query, fetchCourseRecommendation]);

  // Dropdown sort
  const handleMouseEnter = () => setShowDropdown(true);
  const handleDropdownClick = (sortType: "reviews" | "rating") => {
    setSortBy(sortType);
    setShowDropdown(false);
  };

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Urutkan daftar kursus
  const sortedCourses = [...courses].sort((a, b) =>
    sortBy === "reviews" ? b.total_reviewers - a.total_reviewers : b.average_rating - a.average_rating
  );

  if (!user) return <p className="p-4">Loading user data...</p>;

  return (
    <div className="px-8 pt-20 flex flex-col w-full min-h-screen">
      <UserPreference />

      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Rekomendasi Kursus</h1>
        <HybridRecommendations/>
      </div>

      <div className="p-6 border rounded-lg shadow-md bg-white mt-6">
        <h2 className="text-lg font-semibold mb-3">Rekomendasi & Daftar Kursus</h2>

        <input
          type="text"
          placeholder="Masukkan minimal dua kata untuk rekomendasi..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded-md"
        />

        {error && <div className="text-red-500 mt-2">{error}</div>}
        {loadingCourseRecommendations && <div className="text-gray-500 mt-2">Mencari rekomendasi...</div>}
        {courseRecommendations.length > 0 && !loadingCourseRecommendations && (
          <div className="mt-6">
            <RecommendedCoursesList recommendations={courseRecommendations} userInput={query} />
          </div>
        )}

        {/* Filter Sort */}
        <div className="mt-6 flex justify-between items-center">
          <h3 className="text-md font-medium">📚 Semua Kursus:</h3>
          <div className="relative mb-4">
            <button
              ref={buttonRef}
              className="flex items-center bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 transition"
              onMouseEnter={handleMouseEnter}
            >
              <FaFilter className="mr-2" />
              <span>{sortBy === "reviews" ? "Sort by Reviews" : "Sort by Rating"}</span>
              <MdOutlineArrowDropDown className="ml-2 text-lg" />
            </button>

            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute right-0 w-full bg-white border rounded-md shadow-lg overflow-hidden z-20 transition-all duration-300"
              >
                <button
                  onClick={() => handleDropdownClick("reviews")}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${sortBy === "reviews" ? "font-semibold text-blue-600" : "text-gray-700"}`}
                >
                  🔥 Sort by Reviews
                </button>
                <button
                  onClick={() => handleDropdownClick("rating")}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${sortBy === "rating" ? "font-semibold text-blue-600" : "text-gray-700"}`}
                >
                  ⭐ Sort by Rating
                </button>
              </div>
            )}
          </div>
        </div>

        {loadingCourses ? (
          <div className="text-gray-500">⏳ Memuat kursus...</div>
        ) : (
          <CourseList courses={sortedCourses} />
        )}
      </div>
    </div>
  );
}
