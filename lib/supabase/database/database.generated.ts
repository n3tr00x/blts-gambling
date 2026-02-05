export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ako_coupons: {
        Row: {
          ako_round_number: number
          creator_id: number
          hit_count: number
          id: number
          is_hit: boolean
          link: string | null
          season_id: number
          total_odds: number
        }
        Insert: {
          ako_round_number: number
          creator_id: number
          hit_count: number
          id?: number
          is_hit: boolean
          link?: string | null
          season_id: number
          total_odds: number
        }
        Update: {
          ako_round_number?: number
          creator_id?: number
          hit_count?: number
          id?: number
          is_hit?: boolean
          link?: string | null
          season_id?: number
          total_odds?: number
        }
        Relationships: [
          {
            foreignKeyName: "ako_coupons_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ako_coupons_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ako_coupons_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons_with_current"
            referencedColumns: ["id"]
          },
        ]
      }
      leagues: {
        Row: {
          code: string | null
          country: string
          id: number
          level: number
          name: string
        }
        Insert: {
          code?: string | null
          country: string
          id?: number
          level: number
          name: string
        }
        Update: {
          code?: string | null
          country?: string
          id?: number
          level?: number
          name?: string
        }
        Relationships: []
      }
      matchdays: {
        Row: {
          correct: boolean
          id: number
          match_date: string
          related_matchday_id: number | null
          round_number: number
          round_type: string
          round_type_id: number
          season_id: number | null
        }
        Insert: {
          correct?: boolean
          id?: number
          match_date: string
          related_matchday_id?: number | null
          round_number: number
          round_type: string
          round_type_id: number
          season_id?: number | null
        }
        Update: {
          correct?: boolean
          id?: number
          match_date?: string
          related_matchday_id?: number | null
          round_number?: number
          round_type?: string
          round_type_id?: number
          season_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "matchdays_related_matchday_id_fkey"
            columns: ["related_matchday_id"]
            isOneToOne: false
            referencedRelation: "matchdays"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matchdays_round_type_id_fkey"
            columns: ["round_type_id"]
            isOneToOne: false
            referencedRelation: "round_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matchdays_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matchdays_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons_with_current"
            referencedColumns: ["id"]
          },
        ]
      }
      picks: {
        Row: {
          id: number
          is_chosen: boolean
          is_hit: boolean
          league_id: number | null
          matchday_id: number
          odds: number
          player_id: number
          season_id: number
          votes: number
        }
        Insert: {
          id?: number
          is_chosen?: boolean
          is_hit: boolean
          league_id?: number | null
          matchday_id: number
          odds: number
          player_id: number
          season_id: number
          votes?: number
        }
        Update: {
          id?: number
          is_chosen?: boolean
          is_hit?: boolean
          league_id?: number | null
          matchday_id?: number
          odds?: number
          player_id?: number
          season_id?: number
          votes?: number
        }
        Relationships: [
          {
            foreignKeyName: "picks_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "picks_matchday_id_fkey"
            columns: ["matchday_id"]
            isOneToOne: false
            referencedRelation: "matchdays"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "picks_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "picks_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "picks_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons_with_current"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          id: number
          username: string
        }
        Insert: {
          id?: number
          username: string
        }
        Update: {
          id?: number
          username?: string
        }
        Relationships: []
      }
      round_types: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      seasons: {
        Row: {
          end_date: string
          id: number
          name: string
          start_date: string
        }
        Insert: {
          end_date: string
          id?: number
          name: string
          start_date: string
        }
        Update: {
          end_date?: string
          id?: number
          name?: string
          start_date?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          id: number
          pick_id: number | null
          player_id: number
        }
        Insert: {
          id?: number
          pick_id?: number | null
          player_id: number
        }
        Update: {
          id?: number
          pick_id?: number | null
          player_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "votes_pick_id_fkey"
            columns: ["pick_id"]
            isOneToOne: false
            referencedRelation: "picks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      league_pick_stats_view: {
        Row: {
          country: string | null
          hit_count: number | null
          league_name: string | null
          level: number | null
          pick_count: number | null
          total_picks: number | null
        }
        Relationships: []
      }
      matchday_months: {
        Row: {
          matchdays_count: number | null
          month_key: string | null
        }
        Relationships: []
      }
      seasons_with_current: {
        Row: {
          end_date: string | null
          id: number | null
          is_current: boolean | null
          name: string | null
          start_date: string | null
        }
        Insert: {
          end_date?: string | null
          id?: number | null
          is_current?: never
          name?: string | null
          start_date?: string | null
        }
        Update: {
          end_date?: string | null
          id?: number | null
          is_current?: never
          name?: string | null
          start_date?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_round: {
        Args: {
          is_hit: boolean
          picks_input: Json
          related_matchday_id?: number
          round_date: string
          round_type_id: number
          votes_input: Json
        }
        Returns: undefined
      }
      get_played_rounds: {
        Args: never
        Returns: {
          correct: boolean
          id: number
          match_date: string
          round_number: number
          round_type: string
          season_name: string
        }[]
      }
      get_round: {
        Args: { p_matchday_id: number }
        Returns: {
          is_hit: boolean
          picks: Json
          related_matchday_id: number
          round_date: string
          round_number: number
          round_type: string
          season: string
          votes: Json
        }[]
      }
      get_round_for_edit: {
        Args: { p_matchday_id: number }
        Returns: {
          is_hit: boolean
          picks: Json
          related_matchday_id: number
          round_date: string
          round_number: number
          round_type_id: number
          votes: Json
        }[]
      }
      player_ranking_by_month: {
        Args: { month: string }
        Returns: {
          avg_odds: number
          effectiveness: number
          hit_picks: number
          position: number
          total_picks: number
          total_votes: number
          username: string
        }[]
      }
      player_ranking_by_season: {
        Args: { season_id?: number }
        Returns: {
          avg_odds: number
          effectiveness: number
          hit_picks: number
          position: number
          total_picks: number
          total_votes: number
          username: string
        }[]
      }
      player_stats_by_season: {
        Args: { season_id?: number }
        Returns: {
          avg_odds: number
          hit_count: number
          total_picks: number
          username: string
        }[]
      }
      players_effectiveness_progress: {
        Args: { season_id?: number }
        Returns: {
          data: Json
          round_number: number
        }[]
      }
      players_odds_by_round: {
        Args: { season_id?: number }
        Returns: {
          data: Json
          round_number: number
        }[]
      }
      update_round: {
        Args: {
          p_is_hit: boolean
          p_matchday_id: number
          p_picks: Json
          p_related_matchday_id?: number
          p_round_date: string
          p_round_type_id: number
          p_votes: Json
        }
        Returns: undefined
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

