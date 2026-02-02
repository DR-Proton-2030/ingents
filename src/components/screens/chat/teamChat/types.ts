import { IUser } from "@/types/interface/user.interface";

export interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: any;
    isRead: boolean;
    type: "text" | "image";
}

export interface Group {
    id: string;
    name: string;
    members: string[]; // array of user IDs
    createdBy: string;
    createdAt: any;
    lastMessage?: string;
    lastMessageTime?: any;
}
