import { Task as TaskType } from "../task.interface";

export interface TaskReportProps {
  tasks: TaskType[];
  title?: string;
}