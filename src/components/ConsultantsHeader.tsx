import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ConsultantsHeaderProps {
  onAddConsultant: () => void;
}

export function ConsultantsHeader({ onAddConsultant }: ConsultantsHeaderProps) {
  return (
    <div className="flex justify-between bg-gray-500 items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Consultants & Revenue
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your consultants and track revenue
        </p>
      </div>
      <Button
        onClick={onAddConsultant}
        className="bg-gray-900 hover:bg-gray-800 text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add consultant
      </Button>
    </div>
  );
}
