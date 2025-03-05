import { useLocation } from "wouter";
import { Calculator, Book } from "lucide-react";

export default function BottomNav() {
  const [location, navigate] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => navigate("/")}
          className={`flex flex-col items-center space-y-1 ${
            location === "/" ? "text-green-600" : "text-gray-600"
          }`}
        >
          <Calculator className="h-6 w-6" />
          <span className="text-xs">Calculate</span>
        </button>

        <button
          onClick={() => navigate("/terminology")}
          className={`flex flex-col items-center space-y-1 ${
            location === "/terminology" ? "text-green-600" : "text-gray-600"
          }`}
        >
          <Book className="h-6 w-6" />
          <span className="text-xs">Terminology</span>
        </button>
      </div>
    </nav>
  );
}