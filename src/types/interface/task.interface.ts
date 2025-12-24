export type TaskPriority = "urgent" | "high" | "normal" | "low";
export type TaskStatus =
  | "pending"
  | "ready-to-check"
  | "completed"
  | "backlog";
  
export type ViewMode = "spreadsheet" | "timeline" | "calendar" | "board";

export interface Assignee {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  color: string;
}

export interface Task {
  _id: string;
  title: string;
  completed: boolean;
  description?: string;
  parent_task_object_id: string | null;
  due_date?: Date;
  priority: TaskPriority;
  progress: number;
  subtaskCount?: number;
  commentCount?: number;
  status: TaskStatus;
  completed_at?: Date;
  created_by_user_object_id: string;
  completed_by_user_object_id?: string;
  company_object_id: string;
  assignees?: Assignee[];
  subtask?: Task[];
}

export interface TaskSection {
  id: string;
  title: string;
  status: TaskStatus;
  color: string;
  count: number;
  tasks: Task[];
}
