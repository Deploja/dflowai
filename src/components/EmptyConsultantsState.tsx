
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Plus } from "lucide-react";

interface EmptyConsultantsStateProps {
  onAddConsultant: () => void;
}

export function EmptyConsultantsState({ onAddConsultant }: EmptyConsultantsStateProps) {
  return (
    <Card className="text-center py-12 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <CardContent>
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No consultants yet</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Get started by adding your first consultant
        </p>
        <Button onClick={onAddConsultant} className="bg-gray-900 hover:bg-gray-800 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add consultant
        </Button>
      </CardContent>
    </Card>
  );
}
