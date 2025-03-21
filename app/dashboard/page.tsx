"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CourseList from "@/components/CourseList"; 
import RecommendedCoursesList from "@/components/RecommendedCoursesList"; 
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import Link from "next/link";
import { Briefcase, Search } from "lucide-react";

export default function DashboardPage() {
    const [query, setQuery] = useState("");
    const [recommendations, setRecommendations] = useState<{ course_id: string; name: string; similarity: number }[]>([]);
    const [courses, setCourses] = useState<{ course_id: string; name: string }[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);
    const [error, setError] = useState("");

    // Fetch semua kursus saat pertama kali dimuat
    useEffect(() => {
        const fetchCourses = async () => {
            setLoadingCourses(true);
            try {
                const res = await fetch("http://localhost:8000/courses");
                if (!res.ok) throw new Error(`Gagal mengambil data kursus: ${res.statusText}`);
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

    // Fetch rekomendasi berdasarkan input pengguna
    const fetchRecommendations = useCallback(async () => {
        if (!query.trim()) {
            setError("Masukkan nama kursus terlebih dahulu.");
            return;
        }

        setLoadingRecommendations(true);
        setError("");
        setRecommendations([]); // Hapus rekomendasi lama sebelum fetch baru

        try {
            const res = await fetch(`http://localhost:8000/dashboard?course_name=${encodeURIComponent(query)}`);
            if (!res.ok) throw new Error(`Gagal mengambil rekomendasi: ${res.statusText}`);
            const data = await res.json();
            setRecommendations(data.recommendations || []);
        } catch (err) {
            console.error("Error fetching recommendations:", err);
            setError("Terjadi kesalahan saat mengambil data rekomendasi.");
        } finally {
            setLoadingRecommendations(false);
        }
    }, [query]);

    return (
        <div className="px-8 pt-20 flex flex-col w-full min-h-screen">
            {/* User Preference Card */}
            <div className="mb-4">
                <Card className="w-full max-w-sm p-2 shadow-lg">
                    <CardHeader className="flex flex-row items-stretch gap-3">
                        <Briefcase className="w-6 h-8 text-red-600" />
                        <CardTitle className="text-center">User Preference</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">
                            Lengkapi profil berdasarkan keahlian Anda untuk mendapatkan rekomendasi kursus yang lebih relevan.
                        </p>
                        <div className="mt-4">
                            <Button asChild className="w-full bg-red-600 text-white hover:bg-red-700">
                                <Link href="/user-pref">Ambil Perjalanan Anda</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Pencarian Rekomendasi */}
            <div className="p-6 border rounded-lg shadow-md bg-white">
                <h2 className="text-lg font-semibold mb-3"></h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Masukkan nama kursus..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 p-2 border rounded-md"
                    />
                    <Button
                        onClick={fetchRecommendations}
                        className={clsx("px-4 py-2", {
                            "bg-blue-600 text-white": !loadingRecommendations,
                            "bg-gray-400": loadingRecommendations,
                        })}
                        disabled={loadingRecommendations}
                    >
                        {loadingRecommendations ? "Mencari..." : "Cari"}
                    </Button>
                </div>

                {error && <p className="text-red-500 mt-2">{error}</p>}

                {/* Rekomendasi Kursus */}
                {recommendations.length > 0 && (
                    <div className="mt-6">
                            <RecommendedCoursesList recommendations={recommendations} />
                    </div>
                )}
            </div>

            {/* Daftar Semua Kursus */}
            <div className="mt-6">
                <h3 className="text-md font-medium mb-2">📚 Semua Kursus:</h3>
                {loadingCourses ? (
                    <p className="text-gray-500">Memuat kursus...</p>
                ) : (
                    <CourseList courses={courses} />
                )}
            </div>

        </div>
    );
}
