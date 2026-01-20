export interface CreateNewPhaseProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPhaseId?: string) => void;
  task_object_id?: string;
}