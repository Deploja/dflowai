import { Link, Brain, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <Link
        to="/"
        className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
      >
        <div className="p-2.5 rounded-xl bg-gray-900 dark:bg-gray-100">
          <Brain className="h-6 w-6 text-white dark:text-black" />
        </div>
        <div className="flex items-center space-x-1 group-data-[collapsible=icon]:hidden">
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Dflow
          </span>
          <Sparkles className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-xl font-bold text-gray-700 dark:text-gray-300">
            AI
          </span>
        </div>
      </Link>
    </header>
  );
}
