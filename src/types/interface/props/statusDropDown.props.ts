export interface StatusDropdownProps {
  taskId: string;
  currentStatus: string;
  phaseInfo?: {
    _id?: string;
    name: string;
    color?: string;
  };
  onStatusChange: (taskId: string, status: string) => void;
}