
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Consultant, SortConfig } from "@/types/candidate";

export function useCandidatesData() {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'created', direction: 'desc' });

  const { data: consultants, isLoading, error } = useQuery({
    queryKey: ["consultants", sortConfig],
    queryFn: async () => {
      console.log("Fetching candidates with sorting...", sortConfig);
      
      let query = supabase
        .from("consultants")
        .select("*");

      // Apply sorting based on the field
      const ascending = sortConfig.direction === 'asc';
      
      switch (sortConfig.field) {
        case 'name':
          query = query.order('first_name', { ascending });
          break;
        case 'created':
          query = query.order('created_at', { ascending });
          break;
        case 'rating':
          // For now, we'll sort by created_at as a placeholder for rating
          // In a real application, you'd have a rating field
          query = query.order('created_at', { ascending });
          break;
        case 'responsible':
          // Sort by responsible user ID for now
          query = query.order('responsible_user_id', { ascending });
          break;
        default:
          query = query.order('created_at', { ascending });
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching candidates:", error);
        throw error;
      }

      console.log("Fetched candidates:", data);
      
      // Transform the data to match our Consultant interface
      const transformedData = data?.map(consultant => ({
        ...consultant,
        profiles: null // Set to null since we're not joining profiles for now
      })) || [];

      return transformedData as Consultant[];
    },
  });

  const handleSort = (field: string, direction: "asc" | "desc") => {
    console.log("Sorting by:", field, direction);
    setSortConfig({ field, direction });
  };

  return {
    consultants,
    isLoading,
    error,
    handleSort,
    sortConfig
  };
}
