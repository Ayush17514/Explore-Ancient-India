export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      architecture_sites: {
        Row: {
          architectural_style: string | null
          created_at: string
          description: string | null
          dynasty_id: string | null
          era: string | null
          id: string
          image_url: string | null
          location: string | null
          name: string
          region: string | null
          status: string
          submitted_by: string | null
          updated_at: string
        }
        Insert: {
          architectural_style?: string | null
          created_at?: string
          description?: string | null
          dynasty_id?: string | null
          era?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name: string
          region?: string | null
          status?: string
          submitted_by?: string | null
          updated_at?: string
        }
        Update: {
          architectural_style?: string | null
          created_at?: string
          description?: string | null
          dynasty_id?: string | null
          era?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name?: string
          region?: string | null
          status?: string
          submitted_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "architecture_sites_dynasty_id_fkey"
            columns: ["dynasty_id"]
            isOneToOne: false
            referencedRelation: "dynasties"
            referencedColumns: ["id"]
          },
        ]
      }
      authors: {
        Row: {
          biography: string | null
          created_at: string
          era: string | null
          id: string
          language_id: string | null
          name: string
        }
        Insert: {
          biography?: string | null
          created_at?: string
          era?: string | null
          id?: string
          language_id?: string | null
          name: string
        }
        Update: {
          biography?: string | null
          created_at?: string
          era?: string | null
          id?: string
          language_id?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "authors_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      citations: {
        Row: {
          authors: string | null
          citation_type: string | null
          created_at: string
          doi: string | null
          domain: string | null
          id: string
          source: string | null
          status: string
          submitted_by: string | null
          title: string
          url: string | null
          year: string | null
        }
        Insert: {
          authors?: string | null
          citation_type?: string | null
          created_at?: string
          doi?: string | null
          domain?: string | null
          id?: string
          source?: string | null
          status?: string
          submitted_by?: string | null
          title: string
          url?: string | null
          year?: string | null
        }
        Update: {
          authors?: string | null
          citation_type?: string | null
          created_at?: string
          doi?: string | null
          domain?: string | null
          id?: string
          source?: string | null
          status?: string
          submitted_by?: string | null
          title?: string
          url?: string | null
          year?: string | null
        }
        Relationships: []
      }
      datasets: {
        Row: {
          created_at: string
          description: string | null
          domain: string | null
          downloads: number | null
          file_url: string | null
          format: string | null
          id: string
          is_public: boolean | null
          name: string
          size_bytes: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          domain?: string | null
          downloads?: number | null
          file_url?: string | null
          format?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          size_bytes?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          domain?: string | null
          downloads?: number | null
          file_url?: string | null
          format?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          size_bytes?: number | null
        }
        Relationships: []
      }
      dynasties: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          period: string | null
          region: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          period?: string | null
          region?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          period?: string | null
          region?: string | null
        }
        Relationships: []
      }
      languages: {
        Row: {
          created_at: string
          id: string
          name: string
          region: string | null
          script: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          region?: string | null
          script?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          region?: string | null
          script?: string | null
        }
        Relationships: []
      }
      manuscripts: {
        Row: {
          author_id: string | null
          created_at: string
          description: string | null
          domain: string | null
          dynasty_id: string | null
          estimated_period: string | null
          file_url: string | null
          id: string
          language_id: string | null
          repository_source: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_by: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          created_at?: string
          description?: string | null
          domain?: string | null
          dynasty_id?: string | null
          estimated_period?: string | null
          file_url?: string | null
          id?: string
          language_id?: string | null
          repository_source?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_by?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          created_at?: string
          description?: string | null
          domain?: string | null
          dynasty_id?: string | null
          estimated_period?: string | null
          file_url?: string | null
          id?: string
          language_id?: string | null
          repository_source?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_by?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "manuscripts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manuscripts_dynasty_id_fkey"
            columns: ["dynasty_id"]
            isOneToOne: false
            referencedRelation: "dynasties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manuscripts_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      philosophical_schools: {
        Row: {
          core_texts: string | null
          created_at: string
          description: string | null
          founder: string | null
          id: string
          name: string
          period: string | null
          status: string
          submitted_by: string | null
          tradition: string | null
          updated_at: string
        }
        Insert: {
          core_texts?: string | null
          created_at?: string
          description?: string | null
          founder?: string | null
          id?: string
          name: string
          period?: string | null
          status?: string
          submitted_by?: string | null
          tradition?: string | null
          updated_at?: string
        }
        Update: {
          core_texts?: string | null
          created_at?: string
          description?: string | null
          founder?: string | null
          id?: string
          name?: string
          period?: string | null
          status?: string
          submitted_by?: string | null
          tradition?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          institution: string | null
          role_label: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          institution?: string | null
          role_label?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          institution?: string | null
          role_label?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      research_submissions: {
        Row: {
          abstract: string | null
          affiliation: string | null
          authors: string | null
          created_at: string
          domain: string | null
          file_url: string | null
          id: string
          paper_title: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_by: string | null
          updated_at: string
        }
        Insert: {
          abstract?: string | null
          affiliation?: string | null
          authors?: string | null
          created_at?: string
          domain?: string | null
          file_url?: string | null
          id?: string
          paper_title: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_by?: string | null
          updated_at?: string
        }
        Update: {
          abstract?: string | null
          affiliation?: string | null
          authors?: string | null
          created_at?: string
          domain?: string | null
          file_url?: string | null
          id?: string
          paper_title?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_by?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tribal_records: {
        Row: {
          community_name: string
          created_at: string
          description: string | null
          documenter_name: string | null
          id: string
          knowledge_type: string | null
          media_url: string | null
          region: string | null
          status: string
          submitted_by: string | null
          updated_at: string
        }
        Insert: {
          community_name: string
          created_at?: string
          description?: string | null
          documenter_name?: string | null
          id?: string
          knowledge_type?: string | null
          media_url?: string | null
          region?: string | null
          status?: string
          submitted_by?: string | null
          updated_at?: string
        }
        Update: {
          community_name?: string
          created_at?: string
          description?: string | null
          documenter_name?: string | null
          id?: string
          knowledge_type?: string | null
          media_url?: string | null
          region?: string | null
          status?: string
          submitted_by?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "scholar" | "institution" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "scholar", "institution", "user"],
    },
  },
} as const
