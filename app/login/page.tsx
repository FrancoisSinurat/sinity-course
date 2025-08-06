// "use client"
import Login from "@/components/HeroComponents/LoginCard";
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center w-full  h-screen">
          <Login />
    </main>
  );
}
