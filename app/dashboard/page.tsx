'use client';

import { useEffect, useMemo, useCallback, useState } from "react";
import { debounce } from "lodash";
import RecommendedCoursesList from "@/components/CourseComponent/CoursesRecommendation/RecommendedCoursesList";
import AllCoursesList from "@/components/CourseComponent/FetchAllCourse/CourseList";
import { useAuthStore } from '@/app/store/AuthStore';
import { useCourseSearch } from "@/app/hooks/useCourseSearch";
import { fetchMe } from "@/lib/api/auth";
import { useEnrolledCourses } from "@/app/hooks/useEnrolledHistory";
import { usePopularKeyword } from "@/app/hooks/usePopularKeywords";
import EnrollRecommendationsList from '../../components/CourseComponent/FetchAllCourse/RecommendationEnrollList';

export default function DashboardPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  const [loadingUser, setLoadingUser] = useState(true);
  const [keywordVisible, setKeywordVisible] = useState(false);

  const {
    query,
    setQuery,
    fetchRecommendations,
    recommendations,
    loading,
    error
  } = useCourseSearch(apiUrl);

  const { keywords } = usePopularKeyword();
  const { courses, loading: loadingEnrolled } = useEnrolledCourses();

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
      refetchUser().finally(() => setLoadingUser(false));
    } else {
      setLoadingUser(false);
    }
  }, [hasHydrated, token, user, refetchUser]);

  useEffect(() => {
    if (query) {
      debouncedFetchRecommendations();
    }
    return () => debouncedFetchRecommendations.cancel();
  }, [query, debouncedFetchRecommendations]);

  const handleKeywordClick = (keyword: string) => {
    setQuery(keyword);
    setKeywordVisible(false);
  };

  const renderSearchSection = () => (
    <div className="p-4 border rounded-lg shadow-md bg-white mt-6 mb-6">
      <input
        type="text"
        placeholder="Mau belajar apa hari ini?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setKeywordVisible(true)}
        className="w-full p-2 border rounded-md text-center "
      />
      {keywordVisible && keywords.length > 0 && (
        <div className="mt-4 animate-fadeIn space-y-2">
          <h4 className="text-sm font-medium text-gray-700">✨ Kata Kunci Populer</h4>
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw) => (
              <button
                key={kw}
                onClick={() => handleKeywordClick(kw)}
                className="capitalize bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-900 text-sm px-4 py-1 rounded-full shadow-sm transition-all duration-200"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      )}


      {error && <div className="text-red-500 mt-2">{error}</div>}
      {loading && <div className="text-gray-500 mt-2">Mencari rekomendasi...</div>}
      {recommendations.length > 0 && !loading && (
        <div className="mt-6">
          <RecommendedCoursesList recommendations={recommendations} userInput={query} />
        </div>
      )}
    </div>
  );

  if (!hasHydrated || loadingUser) {
    return (
      <div className="px-8 pt-20 flex flex-col w-full min-h-screen">
        {renderSearchSection()}
        <AllCoursesList />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-8 pt-20 flex flex-col w-full min-h-screen">
        {renderSearchSection()}
        <AllCoursesList />
      </div>
    );
  }

  return (
    <div className="px-8 pt-20 flex flex-col w-full min-h-screen ">
      {renderSearchSection()}
      {loadingEnrolled ? (
        <div className="text-sm text-gray-500">Memuat kursus terdaftar...</div>
      ) : courses.length > 0 ? (
        // komponen untuk menampilkan riwayat kursus
        <section>
        <EnrollRecommendationsList/>
        <AllCoursesList />
        </section>
      ) : (
        // menampilkan semua kursus 
        <AllCoursesList />
      )}
    </div>
  );
}
