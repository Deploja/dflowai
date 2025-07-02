
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface WorkingHoursData {
  working_days: string;
  default_working_hours: number;
}

interface WorkingHoursSectionProps {
  orgData: WorkingHoursData;
  onInputChange: (field: string, value: string | number) => void;
}

export function WorkingHoursSection({ orgData, onInputChange }: WorkingHoursSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Working Hours & Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workingDays">Working Days</Label>
            <Select value={orgData.working_days} onValueChange={(value) => onInputChange('working_days', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monday-Friday">Monday - Friday</SelectItem>
                <SelectItem value="Monday-Saturday">Monday - Saturday</SelectItem>
                <SelectItem value="Sunday-Thursday">Sunday - Thursday</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="workingHours">Default Working Hours/Day</Label>
            <Input 
              id="workingHours" 
              type="number"
              value={orgData.default_working_hours}
              onChange={(e) => onInputChange('default_working_hours', parseInt(e.target.value))}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
