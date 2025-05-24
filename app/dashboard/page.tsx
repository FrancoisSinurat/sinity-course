'use client';

import { useEffect, useMemo, useCallback, useState } from "react";
import { debounce } from "lodash";

// import UserPreference from "@/components/users/UserPreference/UserPref";
import RecommendedCoursesList from "@/components/CourseComponent/CoursesRecommendation/RecommendedCoursesList";

import AllCoursesList from "@/components/CourseComponent/FetchAllCourse/CourseList";

import { useAuthStore } from '@/app/store/AuthStore';
import { useCourseSearch } from "@/app/hooks/useCourseSearch";
import { fetchMe } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

import { Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


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



  // variabel untuk ambil data rekomendasi 
  // debounce untuk menghindari panggilan API berulang kali saat mengetik
  const debouncedFetchRecommendations = useMemo(
    () => debounce(fetchRecommendations, 500),
    [fetchRecommendations]
  );

  // variabel untuk ambil data user
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
    if (query) {
      debouncedFetchRecommendations();
    }
    return () => debouncedFetchRecommendations.cancel();
  }, [query, debouncedFetchRecommendations]);

  if (!hasHydrated || loadingUser) return null;

  if(!user){
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
        <AllCoursesList />
      </div>
    );
  }
  
  

  if (user?.category_preference == null) {
    return (
      <div className="px-8 pt-20 flex flex-col w-full min-h-screen">
        {/* <UserPreference onSuccess={refetchUser} /> */}
        <div className="mb-4">
      <Card className="w-full max-w-sm p-2 shadow-lg">
        <CardHeader className="flex flex-row items-stretch gap-3">
          <Briefcase className="w-6 h-8 text-red-600" />
          <CardTitle className="text-center">User Preference</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Complete your profile based on your expertise to receive more relevant course recommendations.
          </p>
          <div className="mt-4">
            <Button asChild className="w-full bg-blue-600 text-white hover:bg-blue-700">
              <Link href="/user-pref">Take Your Journey</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

        <AllCoursesList />
      </div>
    );
  }

  return (
    <div className="px-8 pt-20 flex flex-col w-full min-h-screen">
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
      <AllCoursesList categoryPreference={user?.category_preference} />


    </div>
    
  );
}
