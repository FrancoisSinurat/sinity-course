import { SimpleRegistrationForm } from "@/components/RegisCard";

export default function regisPage() {
  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen">
      {/* Semua komponen ada di dalam root element ini */}
      <div className="w-96">
      <SimpleRegistrationForm />
      </div>
    </main>
  );
}
