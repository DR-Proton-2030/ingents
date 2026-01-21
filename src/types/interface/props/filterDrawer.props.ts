import { ITaskFilters } from "../taskFilter.interface";

export interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ITaskFilters;
  onFilterChange: (filters: ITaskFilters) => void;
  phases: any[];
}
