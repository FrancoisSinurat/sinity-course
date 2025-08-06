import { useEffect, useState } from "react";

export function usePopularKeyword() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPopularKeywords = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/popular-keywords`
        );
        if (!response.ok) {
          throw new Error("Gagal memuat keyword populer.");
        }
        const data: string[] = await response.json();
        setKeywords(data);
      } catch {
        setError("Gagal mengambil data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularKeywords();
  }, []);

  return { keywords, loading, error };
}
