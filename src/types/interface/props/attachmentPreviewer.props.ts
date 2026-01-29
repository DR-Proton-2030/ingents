import { TaskAttachment } from "../task.interface";

export interface AttachmentPreviewerProps {
    isOpen: boolean;
    attachments: TaskAttachment[];
    currentIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    onDownload: (url: string, filename: string) => void;
}