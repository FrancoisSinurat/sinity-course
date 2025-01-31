import Link from "next/link";
import {Button} from "@/components/ui/button";

export function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg p-4 h-full flex flex-col space-between ">
      <h2 className="text-lg font-semibold mb-4">
        <Link href="/">
          SinityCourse
        </Link>
      </h2>
      <nav>
        <ul>
          <li>
            <Link href="/dashboard" className="block py-2 px-3 rounded hover:bg-gray-200">Dashboard</Link>
          </li>

        </ul>
      </nav>
      <div className="LoginSide">
        <Link href="/login">
          <Button variant="outline">Masuk</Button>
        </Link>
      </div>
    </aside>
  );
}
