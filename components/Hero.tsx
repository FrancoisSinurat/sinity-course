import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="text-center">
      <h1 className="text-4xl font-bold mb-4">Temukan Kursus Terbaik untuk Anda</h1>
      <p className="text-gray-600 mb-6">Dapatkan rekomendasi kursus terbaik sesuai minat dan keterampilan Anda.</p>
      <Button className="bg-blue-600 text-white">
        <a href="/dashboard">
        Jelajahi Kursus
        </a>
      </Button>
    </section>
  );
}
