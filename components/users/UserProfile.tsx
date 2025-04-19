"use client";

import { useEffect, useState } from "react";
import ProfileHeader from "./UserProfile/ProfileHeader";
import UserCourses from "@/components/UserData";
import RecommendedUser from "@/components/RecommendUser";
import { getToken } from "@/lib/auth";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (!token) {
        setError("Kamu belum login.");
        setLoading(false);
        return;
      }

      try {
        const resUser = await fetch(`${API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!resUser.ok) throw new Error("Gagal ambil data user.");

        const data = await resUser.json();

        setUser({
          id: data.user_id,
          name: data.reviewer_name,
          email: data.email ,
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Terjadi kesalahan saat mengambil data pengguna.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      {loading ? (
        <div className="text-gray-500 text-center">Memuat data pengguna...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : user ? (
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <ProfileHeader user={user} />
          </div>
          <div className="lg:col-span-2 flex flex-col space-y-6">
            <UserCourses />
            <RecommendedUser />
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">Data pengguna tidak ditemukan.</p>
      )}
    </div>
  );
}
