// hooks/useUnsplashImage.ts
import { useEffect, useState } from "react";

export function useUnsplashImage(query: string) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
            query
          )}&orientation=landscape&per_page=1&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_KEY}`
        );
        const data = await res.json();
        if (data?.results?.[0]?.urls?.regular) {
          setImageUrl(data.results[0].urls.regular);
        }
      } catch (err) {
        console.error("Error fetch Unsplash image:", err);
      }
    };

    fetchImage();
  }, [query]);

  return imageUrl;
}
