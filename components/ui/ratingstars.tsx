// File: "@/components/ui/RatingStars.tsx"
"use client";

import { Star } from "lucide-react";

const RatingStars = ({ rating }: { rating: number }) => {
    return (
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, index) => {
                const isFilled = index < Math.floor(rating);
                const isHalf = index === Math.floor(rating) && rating % 1 >= 0.5;

                return (
                    <div key={index} className=" w-4 h-4">
                        <Star className="absolute w-4 h-4 text-yellow-400" />
                        {isFilled && <Star className="absolute w-4 h-4 text-yellow-500 fill-yellow-500" />}
                        {isHalf && (
                            <div className="absolute w-4 h-4 overflow-hidden">
                                <Star className="absolute w-4 h-4 text-yellow-500 fill-yellow-500" style={{ clipPath: "inset(0 50% 0 0)" }} />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default RatingStars;
