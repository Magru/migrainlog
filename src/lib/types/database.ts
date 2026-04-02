/* Auto-generated types for Supabase schema — update via supabase gen types */

export type PainLocation =
  | "left_forehead"
  | "right_forehead"
  | "left_temple"
  | "right_temple"
  | "left_behind_eye"
  | "right_behind_eye"
  | "left_sinus"
  | "right_sinus"
  | "left_jaw"
  | "right_jaw"
  | "left_ear"
  | "right_ear"
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

export type Gender = "male" | "female";

export type AppLocale = "en" | "ru";

export type MenstrualPhase = "before" | "during" | "after" | "not_applicable";
export type OvulationPhase = "before" | "during" | "after" | "not_applicable";

export type MedicationEffectiveness = "none" | "partial" | "full";

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
          gender: Gender | null;
          locale: AppLocale;
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          gender?: Gender | null;
          locale?: AppLocale;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: {
          display_name?: string | null;
          gender?: Gender | null;
          locale?: AppLocale;
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
          menstrual_phase: MenstrualPhase | null;
          ovulation_phase: OvulationPhase | null;
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
          menstrual_phase?: MenstrualPhase | null;
          ovulation_phase?: OvulationPhase | null;
        };
        Update: {
          started_at?: string;
          ended_at?: string | null;
          intensity?: number | null;
          notes?: string | null;
          menstrual_phase?: MenstrualPhase | null;
          ovulation_phase?: OvulationPhase | null;
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
      user_medications: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          default_dose: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          default_dose?: string | null;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          default_dose?: string | null;
          is_active?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "user_medications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      episode_medications: {
        Row: {
          id: string;
          episode_id: string;
          user_medication_id: string;
          dose: string | null;
          taken_at: string;
          relief_minutes: number | null;
          effectiveness: MedicationEffectiveness | null;
        };
        Insert: {
          id?: string;
          episode_id: string;
          user_medication_id: string;
          dose?: string | null;
          taken_at?: string;
        };
        Update: {
          dose?: string | null;
          taken_at?: string;
          relief_minutes?: number | null;
          effectiveness?: MedicationEffectiveness | null;
        };
        Relationships: [
          {
            foreignKeyName: "episode_medications_episode_id_fkey";
            columns: ["episode_id"];
            isOneToOne: false;
            referencedRelation: "episodes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "episode_medications_user_medication_id_fkey";
            columns: ["user_medication_id"];
            isOneToOne: false;
            referencedRelation: "user_medications";
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
