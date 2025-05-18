import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/AuthStore";
import { fetchMe } from "@/lib/api/auth";

type UserFromApi = {
  user_id: number;
  name: string;
  email: string;
  category_preference?: string | null;
};

export function useAuthUser() {
  const token = useAuthStore((state) => state.token);
  const [user, setUser] = useState<UserFromApi | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchMe(token)
      .then((data) => {
        setUser(data);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error fetching user"))
      .finally(() => setLoading(false));
  }, [token]);

  return { user, loading, error };
}
