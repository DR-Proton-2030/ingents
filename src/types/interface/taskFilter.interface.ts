export interface ITaskFilters {
  userId: string | null;
  statusId: string | null;
  dueDate: string | null;
  onlyMyTasks: boolean;
  sort_by?: "asc" | "desc" | null;
}