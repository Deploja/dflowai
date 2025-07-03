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
    require_approval: true,
  });

  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    loadOrganizationSettings();
  }, []);

  const loadOrganizationSettings = async () => {
    try {
      // Direct query to organization_settings table with proper error handling
      const { data, error } = await supabase
        .from("organization_settings" as any)
        .select("*")
        .limit(1);

      if (error) {
        console.error("Error querying organization_settings:", error);
        // Set default values if table doesn't exist or is empty
        setLocations(["Stockholm, Sweden"]);
        return;
      }

      if (data && data.length > 0) {
        const orgSettings = data[0] as any;
        setOrgData({
          company_name: orgSettings.company_name || "",
          industry: orgSettings.industry || "",
          website: orgSettings.website || "",
          description: orgSettings.description || "",
          address: orgSettings.address || "",
          timezone: orgSettings.timezone || "Europe/Stockholm",
          currency: orgSettings.currency || "SEK",
          fiscal_year_start: orgSettings.fiscal_year_start || "January",
          working_days: orgSettings.working_days || "Monday-Friday",
          default_working_hours: orgSettings.default_working_hours || 8,
          email_notifications: orgSettings.email_notifications ?? true,
          public_profile: orgSettings.public_profile ?? true,
          auto_assignments: orgSettings.auto_assignments ?? false,
          require_approval: orgSettings.require_approval ?? true,
        });
        setLocations(orgSettings.locations || ["Stockholm, Sweden"]);
      } else {
        // Set default values if no data found
        setLocations(["Stockholm, Sweden"]);
      }
    } catch (error: any) {
      console.error("Error loading organization settings:", error);
      setLocations(["Stockholm, Sweden"]);
      toast({
        title: "Error",
        description: "Failed to load organization settings",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (
    field: string,
    value: string | boolean | number
  ) => {
    setOrgData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("organization_settings" as any)
        .upsert({
          ...orgData,
          locations,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Organization settings saved successfully!",
      });
    } catch (error: any) {
      console.error("Error saving organization settings:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save organization settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <CompanyInformationSection
        orgData={orgData}
        onInputChange={handleInputChange}
      />

      <LocationsSection locations={locations} setLocations={setLocations} />

      <RegionalSettingsSection
        orgData={orgData}
        onInputChange={handleInputChange}
      />

      <WorkingHoursSection
        orgData={orgData}
        onInputChange={handleInputChange}
      />

      <SystemPreferencesSection
        orgData={orgData}
        onInputChange={handleInputChange}
      />

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
