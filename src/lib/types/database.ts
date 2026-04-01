/* Auto-generated types for Supabase schema — update via supabase gen types */

export type PainLocation =
  | "left_forehead"
  | "right_forehead"
  | "left_temple"
  | "right_temple"
  | "left_behind_eye"
  | "right_behind_eye"
  | "left_back_of_head"
  | "right_back_of_head"
  | "left_neck"
  | "right_neck"
  | "crown"
  | "full_head";

export type TriggerType =
  | "stress"
  | "sleep"
  | "food"
  | "weather"
  | "hormones"
  | "screen"
  | "alcohol"
  | "caffeine";

export type SymptomType =
  | "aura"
  | "nausea"
  | "light_sensitivity"
  | "sound_sensitivity";

export type SeverityLevel = "mild" | "moderate" | "severe";

export function getSeverityLevel(intensity: number): SeverityLevel {
  if (intensity <= 3) return "mild";
  if (intensity <= 7) return "moderate";
  return "severe";
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: {
          display_name?: string | null;
          is_admin?: boolean;
        };
        Relationships: [];
      };
      episodes: {
        Row: {
          id: string;
          user_id: string;
          started_at: string;
          ended_at: string | null;
          intensity: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          started_at: string;
          ended_at?: string | null;
          intensity?: number | null;
          notes?: string | null;
        };
        Update: {
          started_at?: string;
          ended_at?: string | null;
          intensity?: number | null;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "episodes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      episode_locations: {
        Row: {
          id: string;
          episode_id: string;
          location: PainLocation;
        };
        Insert: {
          id?: string;
          episode_id: string;
          location: PainLocation;
        };
        Update: {
          location?: PainLocation;
        };
        Relationships: [
          {
            foreignKeyName: "episode_locations_episode_id_fkey";
            columns: ["episode_id"];
            isOneToOne: false;
            referencedRelation: "episodes";
            referencedColumns: ["id"];
          },
        ];
      };
      episode_triggers: {
        Row: {
          id: string;
          episode_id: string;
          trigger: TriggerType;
        };
        Insert: {
          id?: string;
          episode_id: string;
          trigger: TriggerType;
        };
        Update: {
          trigger?: TriggerType;
        };
        Relationships: [
          {
            foreignKeyName: "episode_triggers_episode_id_fkey";
            columns: ["episode_id"];
            isOneToOne: false;
            referencedRelation: "episodes";
            referencedColumns: ["id"];
          },
        ];
      };
      episode_symptoms: {
        Row: {
          id: string;
          episode_id: string;
          symptom: SymptomType;
        };
        Insert: {
          id?: string;
          episode_id: string;
          symptom: SymptomType;
        };
        Update: {
          symptom?: SymptomType;
        };
        Relationships: [
          {
            foreignKeyName: "episode_symptoms_episode_id_fkey";
            columns: ["episode_id"];
            isOneToOne: false;
            referencedRelation: "episodes";
            referencedColumns: ["id"];
          },
        ];
      };
      medications: {
        Row: {
          id: string;
          episode_id: string;
          name: string;
          dose: string | null;
          taken_at: string;
        };
        Insert: {
          id?: string;
          episode_id: string;
          name: string;
          dose?: string | null;
          taken_at?: string;
        };
        Update: {
          name?: string;
          dose?: string | null;
          taken_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "medications_episode_id_fkey";
            columns: ["episode_id"];
            isOneToOne: false;
            referencedRelation: "episodes";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
