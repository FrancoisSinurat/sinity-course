import ProfileHeader from "./ProfileHeader";
import { CourseList } from "@/components/CourseCard";
import { Separator } from "@/components/ui/separator";

export default function UserProfile() {
  const user = {
    id: "USR123456",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/avatar.png",
    learningPath: "Full-Stack Developer",
    courseHistory: [
      { id: 1, progress: 100 },
      { id: 2, progress: 45 },
    ],
  };

  const courses = [
    { id: 1, title: "Intro to JavaScript", rating: 4.5, num_enrolled_students: 1200, difficulty_level: "Pemula" },
    { id: 2, title: "Advanced React", rating: 4.7, num_enrolled_students: 800, difficulty_level: "Menengah" },
    { id: 3, title: "Data Structures", rating: 4.8, num_enrolled_students: 1500, difficulty_level: "Mahir" },
  ];

  return (
    <>
      <ProfileHeader user={user} />
      <Separator />
      <h2 className="text-2xl font-semibold mt-6 mb-2">History Course</h2>
      <CourseList courses={courses} history={user.courseHistory} />
    </>
  );
}
