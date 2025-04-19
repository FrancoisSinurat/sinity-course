import { useEffect, useState } from "react";

interface Review {
  name: string;
  average_rating: number;
}

export default function ProfileHistory({ userId }: { userId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch(`https://sinity-fastapi-new-750451431860.us-central1.run.app/recommend_for_user?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews));
  }, [userId]);

  return (
    <div className="p-4 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-3">Riwayat Kursus</h2>
      <ul>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <li key={index} className="p-2 border-b flex justify-between">
              <span className="font-semibold">{review.name}</span>
              <span className="text-yellow-500">⭐ {review.average_rating}</span>
            </li>
          ))
        ) : (
          <p className="text-gray-500">Belum ada riwayat kursus.</p>
        )}
      </ul>
    </div>
  );
}
