'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import RatingStars from '@/components/ui/ratingstars'
import { Users, Layers3 } from 'lucide-react'
import { CategoryRecommendation } from '@/app/hooks/useCategoryRecommendation'
import { formatTotalReviews } from '../ui/formatrevies';

export default function CategoryRecommendationCard({ category }: { category: CategoryRecommendation }) {
  return (
    <Card className="flex flex-col justify-between h-full hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-amber-200 rounded-xl bg-gradient-to-br bg-white via-slate-50 to-slate-100">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-md capitalize">{category.name}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex justify-center gap-2 items-center">
          <RatingStars rating={category.average_rating} />
          <div className="text-yellow-600 text-center font-bold text-sm">
            {category.average_rating.toFixed(1)} / 5
          </div>
        </div>
        <div className="text-center text-sm text-gray-600">
          Similarity Score: <span className="font-semibold">{category.similarity}</span>
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex justify-center pb-4">
        <div className="flex gap-2 flex-wrap justify-center text-xs text-muted-foreground">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Layers3 className="h-4 w-4 text-gray-500" />
            {category.category}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-4 w-4 text-gray-500" />
            {formatTotalReviews(category.total_reviewers)} reviewers
          </Badge>
        </div>
      </CardFooter>
    </Card>
  )
}
