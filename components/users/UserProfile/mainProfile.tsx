"use client";

import { useAuthStore } from "@/app/store/AuthStore";
import ProfileHeader from "./ProfileHeader";
import UserCourses from "@/components/users/UserProfile/UserData";
import RecommendedUser from "@/components/users/recommend/RecommendUser";
import { fetchMe, updateProfile } from "@/lib/api/auth";
import { useEffect, useState } from "react";

interface User {
  user_id: number;
  name: string;
  email: string;
  category_preference: string | null;
}

export default function UserProfile() {
  const token = useAuthStore((state) => state.token);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchMe(token)
      .then((data) => {
        setUser({
          user_id: data.user_id,
          name: data.name,
          email: data.email,
          category_preference: data.category_preference ?? null,
        });
        setError("");
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Gagal mengambil data pengguna")
      )
      .finally(() => setLoading(false));
  }, [token]);

  const handleUpdateUser = async (updatedData: Partial<User>) => {
    if (!token) return alert("User tidak login");
    if (!updatedData.name || !updatedData.email) {
      return alert("Name dan email harus diisi");
    }
    try {
      await updateProfile(token, {
        name: updatedData.name,
        email: updatedData.email,
      });
      const refreshed = await fetchMe(token);
      setUser({
        user_id: refreshed.user_id,
        name: refreshed.name,
        email: refreshed.email,
        category_preference: refreshed.category_preference ?? null,
      });
    } catch {
      alert("Gagal memperbarui profil.");
    }
  };

  if (loading) return <div className="text-center">Memuat data pengguna...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!user) return <div className="text-center">Data pengguna tidak ditemukan.</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <ProfileHeader user={user} onSave={handleUpdateUser} />
        </div>
        <div className="lg:col-span-2 flex flex-col space-y-6">
          <UserCourses />
          <RecommendedUser />
        </div>
      </div>
    </div>
  );
}
