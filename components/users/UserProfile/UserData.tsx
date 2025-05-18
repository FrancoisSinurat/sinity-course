'use client'

import { useEffect, useState } from 'react'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import RatingStars from '@/components/ui/ratingstars'
import { useAuthStore } from '@/app/store/AuthStore'

interface RatedCourse {
  course_id_int: number
  name: string
  rating: number
}

interface UserProfileResponse {
  user_id: number
  rated_courses: RatedCourse[]
}

export default function UserData() {
  const ModelUrl = process.env.NEXT_PUBLIC_API_URL
  const token = useAuthStore((state) => state.token)
  const [data, setData] = useState<UserProfileResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('Token tidak ditemukan. Harap login.')
        return
      }

      try {
        const res = await fetch(`${ModelUrl}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

        const json = await res.json()
        setData(json)
      } catch (error: unknown) {
        console.error('Gagal mengambil data user:', error)
        setError('Gagal memuat data user. Silakan coba lagi.')
      }
    }

    fetchData()
  }, [ModelUrl, token])

  const uniqueReviews = data?.rated_courses.reduce((acc: RatedCourse[], curr) => {
    const exists = acc.find((c) => c.course_id_int === curr.course_id_int)
    if (!exists) acc.push(curr)
    return acc
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Review Terbaru Anda</h2>
      {uniqueReviews && uniqueReviews.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {uniqueReviews.map((course) => (
            <Card
              key={course.course_id_int}
              className="shadow-lg rounded-lg border h-full flex flex-col justify-between"
            >
              <CardHeader className="p-4 text-center">
                <CardTitle className="text-lg capitalize">{course.name}</CardTitle>
              </CardHeader>

              <CardFooter className="mt-auto p-4 justify-center">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <RatingStars rating={course.rating} />
                  <span className="text-yellow-600 font-semibold">
                    {course.rating.toFixed(1)}
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">{error || 'Belum ada review yang diberikan.'}</p>
      )}
    </div>
  )
}
