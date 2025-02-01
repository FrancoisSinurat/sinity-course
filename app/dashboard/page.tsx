import { CourseCard } from '@/components/CourseCard';

export default function DashboardPage() {
  const courses = [
    { id: 1, title: 'Next.js untuk Pemula', category: 'Web Development' },
    { id: 2, title: 'Machine Learning Dasar', category: 'AI' },
  ];

  return (
    <section className='flex flex-col h-full container '>
      
      <div className="recommend">
      <h1 className="text-2xl font-bold mb-4">Rekomendasi Kursus</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      </div>
    </section>
  );
}
