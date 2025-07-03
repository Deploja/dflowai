import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CVFilters } from "./cv/CVFilters";
import { CVTable } from "./cv/CVTable";
import { CV } from "./cv/CVTableTypes";

export function CVManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllAsAdmin, setShowAllAsAdmin] = useState(false);
  const [cvs, setCvs] = useState<CV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  // Mock user role - in real app this would come from auth context
  const userRole = "admin"; // Could be "admin", "owner", or "user"
  const isAdminOrOwner = userRole === "admin" || userRole === "owner";

  useEffect(() => {
    getCurrentUser();
    loadCVs();
  }, [showAllAsAdmin]);

  const getCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const loadCVs = async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase.from("cvs").select("*");

      // If not admin/owner or not showing all, only show user's own CVs
      if (!isAdminOrOwner || !showAllAsAdmin) {
        query = query.eq("user_id", user.id);
      }

      const { data, error } = await query.order("updated_at", {
        ascending: false,
      });

      if (error) throw error;

      // Transform data to match interface
      const transformedCVs: CV[] = data.map((cv) => ({
        ...cv,
        user: {
          name: cv.user_id === user.id ? "You" : "Employee", // In real app, fetch from profiles
          avatar: undefined,
        },
        isOwn: cv.user_id === user.id,
      }));

      setCvs(transformedCVs);
    } catch (error) {
      console.error("Error loading CVs:", error);
      toast({
        title: "Error",
        description: "Failed to load CVs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter CVs based on search term
  const filteredCVs = cvs.filter(
    (cv) =>
      cv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cv.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-pulse" />
          <p className="text-gray-600">Loading CVs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CVFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showAllAsAdmin={showAllAsAdmin}
        setShowAllAsAdmin={setShowAllAsAdmin}
        isAdminOrOwner={isAdminOrOwner}
      />

      <CVTable cvs={filteredCVs} isAdminOrOwner={isAdminOrOwner} />
    </div>
  );
}
