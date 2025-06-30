
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CompanyInformationSection } from "./organization/CompanyInformationSection";
import { LocationsSection } from "./organization/LocationsSection";
import { RegionalSettingsSection } from "./organization/RegionalSettingsSection";
import { WorkingHoursSection } from "./organization/WorkingHoursSection";
import { SystemPreferencesSection } from "./organization/SystemPreferencesSection";

export function OrganizationSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [orgData, setOrgData] = useState({
    company_name: "",
    industry: "",
    website: "",
    description: "",
    address: "",
    timezone: "Europe/Stockholm",
    currency: "SEK",
    fiscal_year_start: "January",
    working_days: "Monday-Friday",
    default_working_hours: 8,
    email_notifications: true,
    public_profile: true,
    auto_assignments: false,
    require_approval: true
  });

  const [locations, setLocations] = useState<string[]>(["Stockholm, Sweden"]);

  useEffect(() => {
    loadOrganizationSettings();
  }, []);

  const loadOrganizationSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('organization_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error querying organization_settings:', error);
        return;
      }

      if (data) {
        setOrgData({
          company_name: data.company_name || "",
          industry: data.industry || "",
          website: data.website || "",
          description: data.description || "",
          address: data.address || "",
          timezone: data.timezone || "Europe/Stockholm",
          currency: data.currency || "SEK",
          fiscal_year_start: data.fiscal_year_start || "January",
          working_days: data.working_days || "Monday-Friday",
          default_working_hours: data.default_working_hours || 8,
          email_notifications: data.email_notifications ?? true,
          public_profile: data.public_profile ?? true,
          auto_assignments: data.auto_assignments ?? false,
          require_approval: data.require_approval ?? true
        });
        setLocations(data.locations || ["Stockholm, Sweden"]);
      }
    } catch (error: any) {
      console.error('Error loading organization settings:', error);
      toast({
        title: "Error",
        description: "Failed to load organization settings",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setOrgData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('organization_settings')
        .upsert({
          ...orgData,
          locations,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving organization settings:', error);
        toast({
          title: "Error",
          description: "Failed to save organization settings",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Organization settings saved successfully!"
      });
    } catch (error: any) {
      console.error('Error saving organization settings:', error);
      toast({
        title: "Error",
        description: "Failed to save organization settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <CompanyInformationSection orgData={orgData} onInputChange={handleInputChange} />
      
      <LocationsSection locations={locations} setLocations={setLocations} />
      
      <RegionalSettingsSection orgData={orgData} onInputChange={handleInputChange} />
      
      <WorkingHoursSection orgData={orgData} onInputChange={handleInputChange} />
      
      <SystemPreferencesSection orgData={orgData} onInputChange={handleInputChange} />

      <Button 
        onClick={handleSave} 
        className="bg-emerald-600 hover:bg-emerald-700 text-white"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Organization Settings"}
      </Button>
    </div>
  );
}
