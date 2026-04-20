export type TaskPriority = "urgent" | "high" | "normal" | "low";
export type TaskStatus =
  | "pending"
  | "ready-to-check"
  | "completed"
  | "backlog";
  
export type ViewMode = "spreadsheet" | "timeline" | "calendar" | "board" | "assistant";

export interface Assignee {
  _id: string;
  full_name: string;
  avatar?: string;
  initials: string;
  color: string;
}

export interface TaskAttachment {
  _id?: string;
  url: string;
  description?: string;
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
  assigned_user_list?: any[];
  attachments?: TaskAttachment[];
  tags?: {
    _id: string;
    name: string;
    color: string;
  }[];
  phase_info?: {
    _id: string;
    name: string;
    color?: string;
    index: number;
    is_default: boolean;
  };
  phase_object_id?: string;
}

export interface TaskSection {
  id: string;
  title: string;
  status: string;
  color: string;
  count: number;
  tasks: Task[];
  currentPage: number;
  totalPages: number;
}
