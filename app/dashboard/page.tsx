'use client';

import { useEffect, useMemo, useCallback, useState } from "react";
import { debounce } from "lodash";

import UserPreference from "@/components/users/UserPreference/UserPref";
import RecommendedCoursesList from "@/components/CourseComponent/CoursesRecommendation/RecommendedCoursesList";
import CategoryRecommendationCard from "@/components/CategoryComponent/CategoryRecommendationCard";
import AllCoursesList from "@/components/CourseComponent/FetchAllCourse/CourseList";

import { useAuthStore } from '@/app/store/AuthStore';
import { useCourseSearch } from "@/app/hooks/useCourseSearch";
import { useCategoryRecommendation } from "@/app/hooks/useCategoryRecommendation";
import { fetchMe } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  const [loadingUser, setLoadingUser] = useState(true);

  const {
    query,
    setQuery,
    fetchRecommendations,
    recommendations,
    loading,
    error
  } = useCourseSearch(apiUrl);

  const {
    fetchCategoryRecommendation,
    recommendations: categoryRecommendations,
    loading: loadingCategory,
    error: errorCategory
  } = useCategoryRecommendation(apiUrl);

  const debouncedFetchRecommendations = useMemo(
    () => debounce(fetchRecommendations, 500),
    [fetchRecommendations]
  );

  const refetchUser = useCallback(async () => {
    if (token) {
      try {
        const freshUser = await fetchMe(token);
        setAuth(token, freshUser);
      } catch (err) {
        console.error("Gagal ambil user:", err);
        logout();
      }
    }
    setLoadingUser(false);
  }, [token, setAuth, logout]);

  useEffect(() => {
    if (!hasHydrated) return;

    if (token && !user) {
      refetchUser();
    } else {
      setLoadingUser(false);
    }
  }, [hasHydrated, token, user, refetchUser]);

  useEffect(() => {
    if (user?.category_preference) {
      fetchCategoryRecommendation();
    }
  }, [user?.category_preference, fetchCategoryRecommendation]);

  useEffect(() => {
    if (query) {
      debouncedFetchRecommendations();
    }
    return () => debouncedFetchRecommendations.cancel();
  }, [query, debouncedFetchRecommendations]);

  if (!hasHydrated || loadingUser) return null;

  if(!user){
    return (
      <div className="px-8 pt-20 flex flex-col w-full min-h-screen">
        <AllCoursesList />
      </div>
    );
  }
  
  

  if (user?.category_preference == null) {
    return (
      <div className="px-8 pt-20 flex flex-col w-full min-h-screen">
        <UserPreference onSuccess={refetchUser} />
      </div>
    );
  }

  return (
    <div className="px-8 pt-20 flex flex-col w-full min-h-screen">
      <div className="p-4 border rounded-lg shadow-md bg-white mt-6 mb-6">
        <input
          type="text"
          placeholder="Mau belajar apa hari ini?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded-md text-center capitalize"
        />
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {loading && <div className="text-gray-500 mt-2">Mencari rekomendasi...</div>}
        {recommendations.length > 0 && !loading && (
          <div className="mt-6">
            <RecommendedCoursesList recommendations={recommendations} userInput={query} />
          </div>
        )}
      </div>

      {user?.category_preference && (
        <div
          onClick={() => router.push("/user-pref")}
          className="p-4 bg-blue-50 border border-blue-200 rounded mb-4 cursor-pointer hover:bg-blue-100 transition"
          title="Klik untuk ubah preferensi"
        >
          <p className="text-blue-800">
            Kategori preferensi Anda: <strong>{user.category_preference}</strong>
          </p>
        </div>
      )}

      {loadingCategory ? (
        <p className="text-gray-500">Memuat rekomendasi berdasarkan kategori...</p>
      ) : errorCategory ? (
        <p className="text-red-500">{errorCategory}</p>
      ) : categoryRecommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {categoryRecommendations.map((course) => (
            <CategoryRecommendationCard key={course.course_id_int} category={course} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Belum ada rekomendasi kategori yang tersedia.</p>
      )}
    </div>
  );
}
