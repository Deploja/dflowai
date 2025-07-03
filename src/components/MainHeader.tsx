import { Link, Brain, Sparkles } from "lucide-react";
import { Button } from "react-day-picker";
import { ThemeToggle } from "./theme-toggle";
import DLogo from "./Logo";
import SignInOutButton from "./Sign-in-out-Button";

export default function MainHeader() {
  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-inherit shadow-sm backdrop-blur-lg  ">
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <DLogo />
          <div className="flex items-center space-x-4">
            <SignInOutButton />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
