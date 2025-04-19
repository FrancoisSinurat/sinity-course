'use client'

import { useEffect, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

type Recommendation = {
  course_id: string
  name: string
  total_reviewers: number
  average_rating: number
}

export default function HybridRecommendation() {
  const [alpha, setAlpha] = useState(0)
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const ModelUrl = process.env.NEXT_PUBLIC_API_URL

  const fetchRecommendations = async (alpha: number) => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No token found")

      const res = await fetch(`${ModelUrl}/hybrid_recommendation?alpha=${alpha}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      setRecommendations(data.recommendations)
    } catch (error) {
      console.error("Failed to fetch recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations(alpha)
  }, [alpha])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="alpha">Adjust Hybrid Weight (Alpha)</Label>
        <Slider
          id="alpha"
          defaultValue={[alpha]}
          max={1}
          step={0.1}
          onValueChange={(value) => setAlpha(value[0])}
        />
        <div className="text-sm text-muted-foreground">
          Content-Based: {(1 - alpha).toFixed(1)} | Collaborative: {alpha.toFixed(1)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))
          : recommendations.map((course) => (
              <Card key={course.course_id} className="hover:shadow-lg transition-all">
                <CardContent className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold capitalize">{course.name}</h3>
                  <div className="text-sm text-muted-foreground">ID: {course.course_id}</div>
                  <div className="text-sm text-muted-foreground">
                    Reviews: {course.total_reviewers} <span> Rating: {course.average_rating.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  )
}
