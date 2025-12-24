export interface TaskFormData {
  title: string;
  description: string;
  due_date: string;
  priority: "High" | "Normal" | "Low";
  status: "pending" | "in-progress" | "completed" | "backlog";
}

export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormData) => Promise<void>;
}
