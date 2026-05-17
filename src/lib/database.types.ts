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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bulletins: {
        Row: {
          created_at: string
          id: string
          pdf_url: string | null
          published_date: string
          title_en: string
          title_mr: string
        }
        Insert: {
          created_at?: string
          id?: string
          pdf_url?: string | null
          published_date?: string
          title_en: string
          title_mr: string
        }
        Update: {
          created_at?: string
          id?: string
          pdf_url?: string | null
          published_date?: string
          title_en?: string
          title_mr?: string
        }
        Relationships: []
      }
      director_current: {
        Row: {
          designation_en: string | null
          designation_mr: string | null
          id: number
          message_en: string | null
          message_mr: string | null
          name_en: string
          name_mr: string
          photo_url: string | null
          updated_at: string
        }
        Insert: {
          designation_en?: string | null
          designation_mr?: string | null
          id?: number
          message_en?: string | null
          message_mr?: string | null
          name_en: string
          name_mr: string
          photo_url?: string | null
          updated_at?: string
        }
        Update: {
          designation_en?: string | null
          designation_mr?: string | null
          id?: number
          message_en?: string | null
          message_mr?: string | null
          name_en?: string
          name_mr?: string
          photo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      faculty: {
        Row: {
          contact: string | null
          created_at: string
          designation_en: string | null
          designation_mr: string | null
          display_order: number
          email: string | null
          id: string
          name_en: string
          name_mr: string
          photo_url: string | null
        }
        Insert: {
          contact?: string | null
          created_at?: string
          designation_en?: string | null
          designation_mr?: string | null
          display_order?: number
          email?: string | null
          id?: string
          name_en: string
          name_mr: string
          photo_url?: string | null
        }
        Update: {
          contact?: string | null
          created_at?: string
          designation_en?: string | null
          designation_mr?: string | null
          display_order?: number
          email?: string | null
          id?: string
          name_en?: string
          name_mr?: string
          photo_url?: string | null
        }
        Relationships: []
      }
      former_directors: {
        Row: {
          created_at: string
          designation_en: string | null
          designation_mr: string | null
          display_order: number
          id: string
          name_en: string
          name_mr: string
          photo_url: string | null
          tenure: string | null
        }
        Insert: {
          created_at?: string
          designation_en?: string | null
          designation_mr?: string | null
          display_order?: number
          id?: string
          name_en: string
          name_mr: string
          photo_url?: string | null
          tenure?: string | null
        }
        Update: {
          created_at?: string
          designation_en?: string | null
          designation_mr?: string | null
          display_order?: number
          id?: string
          name_en?: string
          name_mr?: string
          photo_url?: string | null
          tenure?: string | null
        }
        Relationships: []
      }
      gazettes: {
        Row: {
          created_at: string
          file_size_kb: number | null
          id: string
          pdf_url: string | null
          published_date: string
          title_en: string
          title_mr: string
        }
        Insert: {
          created_at?: string
          file_size_kb?: number | null
          id?: string
          pdf_url?: string | null
          published_date?: string
          title_en: string
          title_mr: string
        }
        Update: {
          created_at?: string
          file_size_kb?: number | null
          id?: string
          pdf_url?: string | null
          published_date?: string
          title_en?: string
          title_mr?: string
        }
        Relationships: []
      }
      gradation_lists: {
        Row: {
          created_at: string
          id: string
          pdf_url: string | null
          published_date: string
          title_en: string
          title_mr: string
        }
        Insert: {
          created_at?: string
          id?: string
          pdf_url?: string | null
          published_date?: string
          title_en: string
          title_mr: string
        }
        Update: {
          created_at?: string
          id?: string
          pdf_url?: string | null
          published_date?: string
          title_en?: string
          title_mr?: string
        }
        Relationships: []
      }
      home_slider: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          photo_url: string
          subtitle_en: string | null
          subtitle_mr: string | null
          title_en: string | null
          title_mr: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          photo_url: string
          subtitle_en?: string | null
          subtitle_mr?: string | null
          title_en?: string | null
          title_mr?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          photo_url?: string
          subtitle_en?: string | null
          subtitle_mr?: string | null
          title_en?: string | null
          title_mr?: string | null
        }
        Relationships: []
      }
      impact_stats: {
        Row: {
          created_at: string
          display_order: number
          id: string
          label_en: string
          label_mr: string
          suffix: string | null
          value: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          label_en: string
          label_mr: string
          suffix?: string | null
          value: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          label_en?: string
          label_mr?: string
          suffix?: string | null
          value?: string
        }
        Relationships: []
      }
      office_sections: {
        Row: {
          created_at: string
          description_en: string | null
          description_mr: string | null
          display_order: number
          id: string
          incharge_en: string | null
          incharge_mr: string | null
          photo_url: string | null
          slug: string
          title_en: string
          title_mr: string
        }
        Insert: {
          created_at?: string
          description_en?: string | null
          description_mr?: string | null
          display_order?: number
          id?: string
          incharge_en?: string | null
          incharge_mr?: string | null
          photo_url?: string | null
          slug: string
          title_en: string
          title_mr: string
        }
        Update: {
          created_at?: string
          description_en?: string | null
          description_mr?: string | null
          display_order?: number
          id?: string
          incharge_en?: string | null
          incharge_mr?: string | null
          photo_url?: string | null
          slug?: string
          title_en?: string
          title_mr?: string
        }
        Relationships: []
      }
      officers: {
        Row: {
          contact: string | null
          created_at: string
          designation_en: string | null
          designation_mr: string | null
          display_order: number
          email: string | null
          id: string
          name_en: string
          name_mr: string
        }
        Insert: {
          contact?: string | null
          created_at?: string
          designation_en?: string | null
          designation_mr?: string | null
          display_order?: number
          email?: string | null
          id?: string
          name_en: string
          name_mr: string
        }
        Update: {
          contact?: string | null
          created_at?: string
          designation_en?: string | null
          designation_mr?: string | null
          display_order?: number
          email?: string | null
          id?: string
          name_en?: string
          name_mr?: string
        }
        Relationships: []
      }
      photo_gallery: {
        Row: {
          created_at: string
          display_order: number
          id: string
          photo_url: string
          taken_date: string | null
          title_en: string | null
          title_mr: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          photo_url: string
          taken_date?: string | null
          title_en?: string | null
          title_mr?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          photo_url?: string
          taken_date?: string | null
          title_en?: string | null
          title_mr?: string | null
        }
        Relationships: []
      }
      press_releases: {
        Row: {
          created_at: string
          description_en: string | null
          description_mr: string | null
          id: string
          pdf_url: string | null
          photo_url: string | null
          published_date: string
          title_en: string
          title_mr: string
        }
        Insert: {
          created_at?: string
          description_en?: string | null
          description_mr?: string | null
          id?: string
          pdf_url?: string | null
          photo_url?: string | null
          published_date?: string
          title_en: string
          title_mr: string
        }
        Update: {
          created_at?: string
          description_en?: string | null
          description_mr?: string | null
          id?: string
          pdf_url?: string | null
          photo_url?: string | null
          published_date?: string
          title_en?: string
          title_mr?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_admin: boolean
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean
        }
        Relationships: []
      }
      promotion_orders: {
        Row: {
          created_at: string
          id: string
          pdf_url: string | null
          published_date: string
          title_en: string
          title_mr: string
        }
        Insert: {
          created_at?: string
          id?: string
          pdf_url?: string | null
          published_date?: string
          title_en: string
          title_mr: string
        }
        Update: {
          created_at?: string
          id?: string
          pdf_url?: string | null
          published_date?: string
          title_en?: string
          title_mr?: string
        }
        Relationships: []
      }
      ranks: {
        Row: {
          created_at: string
          description_en: string | null
          description_mr: string | null
          display_order: number
          id: string
          rank_en: string
          rank_mr: string
        }
        Insert: {
          created_at?: string
          description_en?: string | null
          description_mr?: string | null
          display_order?: number
          id?: string
          rank_en: string
          rank_mr: string
        }
        Update: {
          created_at?: string
          description_en?: string | null
          description_mr?: string | null
          display_order?: number
          id?: string
          rank_en?: string
          rank_mr?: string
        }
        Relationships: []
      }
      recruitments: {
        Row: {
          created_at: string
          file_size_kb: number | null
          id: string
          last_date: string | null
          pdf_url: string | null
          published_date: string
          title_en: string
          title_mr: string
        }
        Insert: {
          created_at?: string
          file_size_kb?: number | null
          id?: string
          last_date?: string | null
          pdf_url?: string | null
          published_date?: string
          title_en: string
          title_mr: string
        }
        Update: {
          created_at?: string
          file_size_kb?: number | null
          id?: string
          last_date?: string | null
          pdf_url?: string | null
          published_date?: string
          title_en?: string
          title_mr?: string
        }
        Relationships: []
      }
      rti_documents: {
        Row: {
          created_at: string
          display_order: number
          file_size_kb: number | null
          id: string
          pdf_url: string | null
          title_en: string
          title_mr: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          file_size_kb?: number | null
          id?: string
          pdf_url?: string | null
          title_en: string
          title_mr: string
        }
        Update: {
          created_at?: string
          display_order?: number
          file_size_kb?: number | null
          id?: string
          pdf_url?: string | null
          title_en?: string
          title_mr?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value_text: string | null
          value_url: string | null
        }
        Insert: {
          key: string
          updated_at?: string
          value_text?: string | null
          value_url?: string | null
        }
        Update: {
          key?: string
          updated_at?: string
          value_text?: string | null
          value_url?: string | null
        }
        Relationships: []
      }
      tenders: {
        Row: {
          created_at: string
          file_size_kb: number | null
          id: string
          last_date: string | null
          pdf_url: string | null
          published_date: string
          title_en: string
          title_mr: string
        }
        Insert: {
          created_at?: string
          file_size_kb?: number | null
          id?: string
          last_date?: string | null
          pdf_url?: string | null
          published_date?: string
          title_en: string
          title_mr: string
        }
        Update: {
          created_at?: string
          file_size_kb?: number | null
          id?: string
          last_date?: string | null
          pdf_url?: string | null
          published_date?: string
          title_en?: string
          title_mr?: string
        }
        Relationships: []
      }
      training_calendars: {
        Row: {
          created_at: string
          id: string
          pdf_url: string | null
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          pdf_url?: string | null
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          pdf_url?: string | null
          year?: number
        }
        Relationships: []
      }
      training_schedules: {
        Row: {
          coordinator_en: string | null
          coordinator_mr: string | null
          course_name_en: string
          course_name_mr: string
          created_at: string
          date_from: string | null
          date_to: string | null
          duration_en: string | null
          duration_mr: string | null
          eligibility_en: string | null
          eligibility_mr: string | null
          id: string
          pdf_url: string | null
        }
        Insert: {
          coordinator_en?: string | null
          coordinator_mr?: string | null
          course_name_en: string
          course_name_mr: string
          created_at?: string
          date_from?: string | null
          date_to?: string | null
          duration_en?: string | null
          duration_mr?: string | null
          eligibility_en?: string | null
          eligibility_mr?: string | null
          id?: string
          pdf_url?: string | null
        }
        Update: {
          coordinator_en?: string | null
          coordinator_mr?: string | null
          course_name_en?: string
          course_name_mr?: string
          created_at?: string
          date_from?: string | null
          date_to?: string | null
          duration_en?: string | null
          duration_mr?: string | null
          eligibility_en?: string | null
          eligibility_mr?: string | null
          id?: string
          pdf_url?: string | null
        }
        Relationships: []
      }
      transfer_orders: {
        Row: {
          created_at: string
          id: string
          pdf_url: string | null
          published_date: string
          title_en: string
          title_mr: string
        }
        Insert: {
          created_at?: string
          id?: string
          pdf_url?: string | null
          published_date?: string
          title_en: string
          title_mr: string
        }
        Update: {
          created_at?: string
          id?: string
          pdf_url?: string | null
          published_date?: string
          title_en?: string
          title_mr?: string
        }
        Relationships: []
      }
      welfare_activities: {
        Row: {
          activity_date: string | null
          created_at: string
          id: string
          photo_url: string | null
          title_en: string
          title_mr: string
        }
        Insert: {
          activity_date?: string | null
          created_at?: string
          id?: string
          photo_url?: string | null
          title_en: string
          title_mr: string
        }
        Update: {
          activity_date?: string | null
          created_at?: string
          id?: string
          photo_url?: string | null
          title_en?: string
          title_mr?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
<claude-code-hint v="1" type="plugin" value="supabase@claude-plugins-official" />
