import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">SinityCourse</h1>
      {/* <div>
        <Link href="/login">
          <Button variant="outline">Masuk</Button>
        </Link>
      </div> */}
    </nav>
  );
}
