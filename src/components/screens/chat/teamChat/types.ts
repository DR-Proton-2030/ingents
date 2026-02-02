import { IUser } from "@/types/interface/user.interface";

export interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: any;
    isRead: boolean;
    type: "text" | "image";
}
