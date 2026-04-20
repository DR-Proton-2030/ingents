import { IProject } from "../project.interface";
import { ViewMode } from "../task.interface";
import { ITaskFilters } from "../taskFilter.interface";

export interface TaskHeaderProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilter?: () => void;
  onCreateProject?: () => void;
  onCreateTask?: () => void;
  filters: ITaskFilters;
  onFilterChange: (filters: ITaskFilters) => void;
  phases: any[];
  selectedProjectId?: string;
  onProjectSelect: (project: IProject | null) => void;
  onDownloadReport?: () => void;
  onIntegrationsOpen?: () => void;
}

export interface ViewTab {
  id: ViewMode;
  label: string;
  icon: React.ElementType;
}