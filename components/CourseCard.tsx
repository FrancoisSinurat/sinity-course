export function CourseCard({
  course,
}: {
  course: { id: number; title: string; category: string };
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-bold">{course.title}</h3>
      <p className="text-gray-500">{course.category}</p>
    </div>
  );
}
