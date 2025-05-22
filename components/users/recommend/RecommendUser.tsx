'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardFooter, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import RatingStars from '@/components/ui/ratingstars'
import { Users } from 'lucide-react'
import { useAuthStore } from '@/app/store/AuthStore'
import { formatTotalReviews } from '@/components/ui/formatrevies'

interface RecommendationCourse {
  course_id_int: number
  name: string
  total_reviewers: number
  average_rating: number
}

interface ExistingUserData {
  user_id: number
  recommendations: RecommendationCourse[]
}

interface NewUserData {
  recommendations: RecommendationCourse[]
}

type RecommendationResponse = {
  status: string
  message: string
  data: ExistingUserData | NewUserData
}

export default function RecommendUser() {
  const ModelUrl = process.env.NEXT_PUBLIC_API_URL
  const token = useAuthStore((state) => state.token)
  const [data, setData] = useState<RecommendationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('Token tidak ditemukan. Harap login.')
        return
      }

      try {
        const res = await fetch(`${ModelUrl}/recommend_hybrid`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

        const json = await res.json()
        setData(json)
      } catch (error: unknown) {
        console.error('Gagal mengambil data rekomendasi:', error)
        setError('Gagal memuat rekomendasi. Silakan coba lagi.')
      }
    }

    fetchData()
  }, [ModelUrl, token])

  const uniqueRecommendations = data?.data?.recommendations
    ? data.data.recommendations.filter(
        (course, index, self) =>
          index === self.findIndex((c) => c.course_id_int === course.course_id_int)
      )
    : []

  return (
    <div className="p-4 border rounded-2xl shadow-md mt-6 bg-gradient-to-br from-white via-slate-50 to-slate-100">
      <h2 className="text-lg font-bold mb-2">Rekomendasi Kursus</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-3">{data?.message}</p>
          {uniqueRecommendations.length ? (
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-4">
              {uniqueRecommendations.map((course) => (
                <Card
                  key={course.course_id_int}
                  className="flex flex-col justify-between h-full hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 rounded-xl"
                >
                  <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-md capitalize">{course.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center gap-2">
                      <RatingStars rating={course.average_rating} />
                      <div className="text-yellow-600 text-center font-bold text-sm">
                        {course.average_rating.toFixed(1)} / 5
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto flex justify-center pb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{formatTotalReviews(course.total_reviewers)} reviewers</span>
                      </Badge>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p>{data ? 'Tidak ada rekomendasi saat ini.' : 'Memuat rekomendasi...'}</p>
          )}
        </>
      )}
    </div>
  )
}
