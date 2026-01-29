import { TaskAttachment } from "../task.interface";

export interface AttachmentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    attachments: TaskAttachment[];
    taskTitle: string;
    position: { top: number; left: number };
}
