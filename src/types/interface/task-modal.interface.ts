export interface TaskFormData {
  title: string;
  description: string;
  due_date: string;
  priority: "High" | "Normal" | "Low";
  // status: "pending" | "in-progress" | "completed" | "backlog";
  assigned_user_list: any[]
}

export interface SubTaskFormData {
  title: string;
  description: string;
  due_date: string;
  priority: "High" | "Normal" | "Low";
  // status: "pending" | "in-progress" | "completed" | "backlog";
  assigned_user_list: any[]
}
export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormData) => Promise<void>;
}

export interface CreateSubtaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormData) => Promise<void>;
}