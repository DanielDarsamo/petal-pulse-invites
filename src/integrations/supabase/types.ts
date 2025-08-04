export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      backgrounds: {
        Row: {
          blur: number | null
          created_at: string
          id: string
          image_url: string | null
          opacity: number | null
          overlay_color: string | null
          updated_at: string
          wedding_id: string
        }
        Insert: {
          blur?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          opacity?: number | null
          overlay_color?: string | null
          updated_at?: string
          wedding_id: string
        }
        Update: {
          blur?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          opacity?: number | null
          overlay_color?: string | null
          updated_at?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "backgrounds_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          address: string | null
          created_at: string
          event_time: string | null
          id: string
          latitude: number | null
          longitude: number | null
          marker_color: string | null
          title: string
          updated_at: string
          wedding_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          event_time?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          marker_color?: string | null
          title: string
          updated_at?: string
          wedding_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          event_time?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          marker_color?: string | null
          title?: string
          updated_at?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      guestbook: {
        Row: {
          created_at: string
          guest_name: string
          id: string
          message: string
          wedding_id: string
        }
        Insert: {
          created_at?: string
          guest_name: string
          id?: string
          message: string
          wedding_id: string
        }
        Update: {
          created_at?: string
          guest_name?: string
          id?: string
          message?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guestbook_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          allergies: string | null
          created_at: string
          full_name: string
          id: string
          invitation_code: string
          meal_preference: string | null
          plus_one: boolean | null
          rsvp_status: string | null
          updated_at: string
          wedding_id: string
        }
        Insert: {
          allergies?: string | null
          created_at?: string
          full_name: string
          id?: string
          invitation_code: string
          meal_preference?: string | null
          plus_one?: boolean | null
          rsvp_status?: string | null
          updated_at?: string
          wedding_id: string
        }
        Update: {
          allergies?: string | null
          created_at?: string
          full_name?: string
          id?: string
          invitation_code?: string
          meal_preference?: string | null
          plus_one?: boolean | null
          rsvp_status?: string | null
          updated_at?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      music: {
        Row: {
          autoplay: boolean | null
          created_at: string
          file_path: string
          id: string
          updated_at: string
          volume: number | null
          wedding_id: string
        }
        Insert: {
          autoplay?: boolean | null
          created_at?: string
          file_path: string
          id?: string
          updated_at?: string
          volume?: number | null
          wedding_id: string
        }
        Update: {
          autoplay?: boolean | null
          created_at?: string
          file_path?: string
          id?: string
          updated_at?: string
          volume?: number | null
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "music_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      weddings: {
        Row: {
          copyright_text: string | null
          couple1_name: string
          couple2_name: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
          wedding_date: string | null
        }
        Insert: {
          copyright_text?: string | null
          couple1_name: string
          couple2_name: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          wedding_date?: string | null
        }
        Update: {
          copyright_text?: string | null
          couple1_name?: string
          couple2_name?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          wedding_date?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_invitation_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
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
