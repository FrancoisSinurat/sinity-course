import { CourseCard } from "@/components/CourseCard";

export default function CourseHistory({ history }: { history: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6  ">
      {history.length > 0 ? (
        history.map((course) => <CourseCard key={course.id} course={course} isTaken={true} />)
      ) : (
        <p className="text-gray-500 col-span-full text-center">No course history available.</p>
      )}
    </div>
  );
}
