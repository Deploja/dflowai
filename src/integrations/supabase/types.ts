export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_status: {
        Row: {
          created_at: string
          id: string
          last_seen: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_seen?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_seen?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      consultants: {
        Row: {
          availability: string
          created_at: string
          cv_id: string | null
          email: string
          experience_years: number
          first_name: string
          hourly_rate: number
          id: string
          last_activity_date: string | null
          location: string
          phone: string | null
          responsible_user_id: string | null
          role: string | null
          skills: string[]
          status: string | null
          surname: string
          title: string
          updated_at: string
        }
        Insert: {
          availability?: string
          created_at?: string
          cv_id?: string | null
          email: string
          experience_years?: number
          first_name: string
          hourly_rate?: number
          id?: string
          last_activity_date?: string | null
          location: string
          phone?: string | null
          responsible_user_id?: string | null
          role?: string | null
          skills?: string[]
          status?: string | null
          surname: string
          title: string
          updated_at?: string
        }
        Update: {
          availability?: string
          created_at?: string
          cv_id?: string | null
          email?: string
          experience_years?: number
          first_name?: string
          hourly_rate?: number
          id?: string
          last_activity_date?: string | null
          location?: string
          phone?: string | null
          responsible_user_id?: string | null
          role?: string | null
          skills?: string[]
          status?: string | null
          surname?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultants_cv_id_fkey"
            columns: ["cv_id"]
            isOneToOne: false
            referencedRelation: "cvs"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          client_name: string
          consultant_id: string
          contract_value: number
          created_at: string
          end_date: string | null
          id: string
          project_name: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          client_name: string
          consultant_id: string
          contract_value: number
          created_at?: string
          end_date?: string | null
          id?: string
          project_name: string
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          client_name?: string
          consultant_id?: string
          contract_value?: number
          created_at?: string
          end_date?: string | null
          id?: string
          project_name?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
        ]
      }
      cv_parsing_results: {
        Row: {
          created_at: string
          cv_id: string
          error_message: string | null
          extracted_data: Json
          id: string
          parsing_status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cv_id: string
          error_message?: string | null
          extracted_data: Json
          id?: string
          parsing_status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          cv_id?: string
          error_message?: string | null
          extracted_data?: Json
          id?: string
          parsing_status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cv_parsing_results_cv_id_fkey"
            columns: ["cv_id"]
            isOneToOne: false
            referencedRelation: "cvs"
            referencedColumns: ["id"]
          },
        ]
      }
      cv_shares: {
        Row: {
          created_at: string
          created_by: string
          cv_id: string
          expires_at: string | null
          id: string
          share_method: string
          shared_with_email: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          cv_id: string
          expires_at?: string | null
          id?: string
          share_method: string
          shared_with_email?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          cv_id?: string
          expires_at?: string | null
          id?: string
          share_method?: string
          shared_with_email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cv_shares_cv_id_fkey"
            columns: ["cv_id"]
            isOneToOne: false
            referencedRelation: "cvs"
            referencedColumns: ["id"]
          },
        ]
      }
      cvs: {
        Row: {
          consultant_id: string | null
          content: Json | null
          created_at: string
          created_by: string | null
          file_url: string | null
          id: string
          is_parsed: boolean | null
          is_shared: boolean
          language: string
          last_activity_at: string | null
          last_activity_by: string | null
          parsed_data: Json | null
          share_token: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          consultant_id?: string | null
          content?: Json | null
          created_at?: string
          created_by?: string | null
          file_url?: string | null
          id?: string
          is_parsed?: boolean | null
          is_shared?: boolean
          language?: string
          last_activity_at?: string | null
          last_activity_by?: string | null
          parsed_data?: Json | null
          share_token?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          consultant_id?: string | null
          content?: Json | null
          created_at?: string
          created_by?: string | null
          file_url?: string | null
          id?: string
          is_parsed?: boolean | null
          is_shared?: boolean
          language?: string
          last_activity_at?: string | null
          last_activity_by?: string | null
          parsed_data?: Json | null
          share_token?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cvs_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
        ]
      }
      filter_presets: {
        Row: {
          created_at: string
          filters: Json
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          filters: Json
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          filters?: Json
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          location: string | null
          phone: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
          location?: string | null
          phone?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          location?: string | null
          phone?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          client_name: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          project_url: string | null
          start_date: string
          status: string
          technologies: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_name?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          project_url?: string | null
          start_date: string
          status?: string
          technologies?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_name?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          project_url?: string | null
          start_date?: string
          status?: string
          technologies?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      revenue: {
        Row: {
          amount: number
          consultant_id: string
          contract_id: string
          created_at: string
          description: string | null
          id: string
          revenue_date: string
          updated_at: string
        }
        Insert: {
          amount: number
          consultant_id: string
          contract_id: string
          created_at?: string
          description?: string | null
          id?: string
          revenue_date: string
          updated_at?: string
        }
        Update: {
          amount?: number
          consultant_id?: string
          contract_id?: string
          created_at?: string
          description?: string | null
          id?: string
          revenue_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "revenue_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revenue_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_presentations: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_skills: {
        Row: {
          created_at: string
          id: string
          proficiency_level: string
          skill_name: string
          skill_type: string
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          proficiency_level?: string
          skill_name: string
          skill_type?: string
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          proficiency_level?: string
          skill_name?: string
          skill_type?: string
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
