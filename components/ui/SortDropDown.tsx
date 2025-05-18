// components/SortDropdown.tsx
import { FaFilter } from "react-icons/fa";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useRef, useEffect } from "react";

export default function SortDropdown({
  sortBy,
  setSortBy,
  showDropdown,
  setShowDropdown,
}: {
  sortBy: "reviews" | "rating";
  setSortBy: (val: "reviews" | "rating") => void;
  showDropdown: boolean;
  setShowDropdown: (val: boolean) => void;
}) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowDropdown]);

  return (
    <div className="relative mb-4">
      <button
        ref={buttonRef}
        className="flex items-center bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <FaFilter className="mr-2" />
        {sortBy === "reviews" ? "Sort by Reviews" : "Sort by Rating"}
        <MdOutlineArrowDropDown className="ml-2 text-lg" />
      </button>

      {showDropdown && (
        <div ref={dropdownRef} className="absolute right-0 w-full bg-white border rounded-md shadow-lg z-20">
          {["reviews", "rating"].map((type) => (
            <button
              key={type}
              onClick={() => {
                setSortBy(type as "reviews" | "rating");
                setShowDropdown(false);
              }}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                sortBy === type ? "font-semibold text-blue-600" : "text-gray-700"
              }`}
            >
              {type === "reviews" ? "🔥 Sort by Reviews" : "⭐ Sort by Rating"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
