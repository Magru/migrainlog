import type { PainLocation, TriggerType, SymptomType, MedicationEffectiveness } from "./database";

/** Data collected during the 3-step quick-log flow */
export interface EpisodeFormData {
  locations: PainLocation[];
  intensity: number;
  triggers: TriggerType[];
  symptoms: SymptomType[];
  startedAt: string; // ISO string, defaults to "now"
  notes?: string;
}

/** Medication logged for an episode */
export interface EpisodeMedication {
  id: string;
  userMedicationId: string;
  name: string;
  dose: string | null;
  takenAt: string;
  reliefMinutes: number | null;
  effectiveness: MedicationEffectiveness | null;
}

/** User's medication library entry */
export interface UserMedication {
  id: string;
  name: string;
  defaultDose: string | null;
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
  medications: EpisodeMedication[];
}
