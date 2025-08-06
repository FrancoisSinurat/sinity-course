'use client'

import {
  Search,
  Star,
  BookOpen,
  History,
} from "lucide-react"

export const FeatureSection = () => {
  return (
    <section id="fitur" className="scroll-mt-20 mt-6 py-16 bg-background">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Fitur Aplikasi</h2>
        <ul className="grid md:grid-cols-2 gap-6">
          
          <li className="bg-background p-6 rounded-xl shadow border flex items-start gap-4">
            <Search className="w-6 h-6 mt-1 text-primary" />
            <div>
              <h3 className="font-semibold">Pencarian Kursus</h3>
              <p className="text-sm text-muted-foreground">
                Temukan kursus sesuai minat melalui kata kunci.
              </p>
            </div>
          </li>

          <li className="bg-background p-6 rounded-xl shadow border flex items-start gap-4">
            <BookOpen className="w-6 h-6 mt-1 text-primary" />
            <div>
              <h3 className="font-semibold">Rekomendasi Kursus</h3>
              <p className="text-sm text-muted-foreground">
                Rekomendasi berdasarkan kursus yang pernah diikuti.
              </p>
            </div>
          </li>

          <li className="bg-background p-6 rounded-xl shadow border flex items-start gap-4">
            <Star className="w-6 h-6 mt-1 text-primary" />
            <div>
              <h3 className="font-semibold">Penilaian Kursus</h3>
              <p className="text-sm text-muted-foreground">
                Pengguna dapat memberikan rating untuk kursus yang diikuti.
              </p>
            </div>
          </li>

          <li className="bg-background p-6 rounded-xl shadow border flex items-start gap-4">
            <History className="w-6 h-6 mt-1 text-primary" />
            <div>
              <h3 className="font-semibold">Riwayat Kursus</h3>
              <p className="text-sm text-muted-foreground">
                Menyimpan dan menampilkan riwayat kursus yang telah diambil.
              </p>
            </div>
          </li>


        </ul>
      </div>
    </section>
  )
}
