
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2 } from "lucide-react";

interface CompanyData {
  company_name: string;
  industry: string;
  website: string;
  description: string;
  address: string;
}

interface CompanyInformationSectionProps {
  orgData: CompanyData;
  onInputChange: (field: string, value: string) => void;
}

export function CompanyInformationSection({ orgData, onInputChange }: CompanyInformationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="h-5 w-5 mr-2" />
          Company Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input 
              id="companyName" 
              value={orgData.company_name}
              onChange={(e) => onInputChange('company_name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input 
              id="industry" 
              value={orgData.industry}
              onChange={(e) => onInputChange('industry', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input 
              id="website" 
              value={orgData.website}
              onChange={(e) => onInputChange('website', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input 
              id="address" 
              value={orgData.address}
              onChange={(e) => onInputChange('address', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Company Description</Label>
          <Textarea 
            id="description" 
            value={orgData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
