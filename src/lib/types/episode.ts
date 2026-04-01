import type { PainLocation, TriggerType, SymptomType } from "./database";

/** Data collected during the 3-step quick-log flow */
export interface EpisodeFormData {
  locations: PainLocation[];
  intensity: number;
  triggers: TriggerType[];
  symptoms: SymptomType[];
  startedAt: string; // ISO string, defaults to "now"
  notes?: string;
}

/** Full episode with relations (for display) */
export interface EpisodeWithDetails {
  id: string;
  userId: string;
  startedAt: string;
  endedAt: string | null;
  intensity: number | null;
  notes: string | null;
  createdAt: string;
  locations: PainLocation[];
  triggers: TriggerType[];
  symptoms: SymptomType[];
}
