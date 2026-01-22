import { IPhase } from "../phase.interface";

export interface PhaseSelectProps {
  phases: IPhase[];
  selectedPhaseId?: string;
  onPhaseChange: (id: string) => void;
  label?: string;
}
