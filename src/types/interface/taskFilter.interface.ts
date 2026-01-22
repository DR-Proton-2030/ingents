export interface ITaskFilters {
  userId: string | null;
  statusId: string | null;
  dueDate: string | null;
  onlyMyTasks: boolean;
  sort_by?: "asc" | "desc" | null;
  project_object_id?: string | null;
}