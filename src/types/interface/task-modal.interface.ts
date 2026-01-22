import { IPhase } from "./phase.interface";
import { TaskStatus } from "./task.interface";

export interface AttachmentInput {
  file?: File;
  url?: string;
  description?: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  due_date: string;
  priority: "High" | "Normal" | "Low";
  phase_object_id?: string;
  assigned_user_list: any[];
  attachments?: AttachmentInput[];
}

export interface SubTaskFormData {
  title: string;
  description: string;
  due_date: string;
  priority: "High" | "Normal" | "Low";
  status?: TaskStatus;
  assigned_user_list: any[]
}
export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormData) => Promise<void>;
  initialStatus?: TaskStatus;
  phases: IPhase[];
}

export interface CreateSubtaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormData) => Promise<void>;
  initialStatus?: TaskStatus;
  phases: IPhase[];
}