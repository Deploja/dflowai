
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";

interface SystemPreferencesData {
  email_notifications: boolean;
  public_profile: boolean;
  auto_assignments: boolean;
  require_approval: boolean;
}

interface SystemPreferencesSectionProps {
  orgData: SystemPreferencesData;
  onInputChange: (field: string, value: boolean) => void;
}

export function SystemPreferencesSection({ orgData, onInputChange }: SystemPreferencesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          System Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-gray-500">Send email notifications for system updates</p>
          </div>
          <Switch 
            checked={orgData.email_notifications}
            onCheckedChange={(checked) => onInputChange('email_notifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Public Company Profile</Label>
            <p className="text-sm text-gray-500">Make company profile visible to partners</p>
          </div>
          <Switch 
            checked={orgData.public_profile}
            onCheckedChange={(checked) => onInputChange('public_profile', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auto Assignment Matching</Label>
            <p className="text-sm text-gray-500">Automatically suggest consultants for assignments</p>
          </div>
          <Switch 
            checked={orgData.auto_assignments}
            onCheckedChange={(checked) => onInputChange('auto_assignments', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Require Manager Approval</Label>
            <p className="text-sm text-gray-500">Require manager approval for timesheet submissions</p>
          </div>
          <Switch 
            checked={orgData.require_approval}
            onCheckedChange={(checked) => onInputChange('require_approval', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
