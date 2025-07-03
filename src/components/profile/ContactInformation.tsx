import { Mail, Phone, MapPin, Calendar } from "lucide-react";

interface ConsultantProfile {
  email: string;
  phone?: string;
  location?: string;
  created_at: string;
}

interface UserProfile {
  email?: string;
  phone?: string;
  location?: string;
}

interface ContactInformationProps {
  consultant: ConsultantProfile | null;
  userProfile: UserProfile | null;
}

export function ContactInformation({
  consultant,
  userProfile,
}: ContactInformationProps) {
  return (
    <div>
      <h3 className="font-semibold  mb-3">Contact Information</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>
            {consultant?.email || userProfile?.email || "Not provided"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>
            {consultant?.phone || userProfile?.phone || "Not provided"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>
            {consultant?.location || userProfile?.location || "Not provided"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>
            Joined{" "}
            {consultant
              ? new Date(consultant.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })
              : "Recently"}
          </span>
        </div>
      </div>
    </div>
  );
}
