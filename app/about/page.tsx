// components/AboutSection.tsx
import React from "react"
import { FeatureSection } from "@/components/FeatureSection"

export default function AboutSection() {
  return (
    <div className="mt-12 mb-12 ">

    <section  className="max-w-7xl mx-auto px-6 py-12 mt-8 space-y-10 scroll-mt-20 ">
      <div className="flex flex-col justify-center text-center ">
        <h1 className="text-4xl font-bold mb-4">Tentang SinityCourse</h1>
        <p className="text-gray-600 text-lg">
          SinityCourse adalah sistem rekomendasi kursus online berbasis <span className="font-semibold">Hybrid Filtering</span> yang dirancang untuk membantu Anda menemukan kursus terbaik berdasarkan minat, riwayat belajar, dan rating pengguna lain.
        </p>
      </div>
    </section>
      <FeatureSection />
    </div>

  )
}
