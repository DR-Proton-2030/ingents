import { MeetingDetails, Participant as MeetingParticipant } from "@/utils/api/meeting/meeting.api";

export interface PeerStream {
    peerId: string;
    stream: MediaStream;
    userName?: string;
    isVideoOff?: boolean;
    isMuted?: boolean;
    reaction?: string | null;
    isHandRaised?: boolean;
    videoFilter?: string;
    videoBackground?: string;
    isScreenSharing?: boolean;
    lastSeen?: number;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    senderName?: string;
    text: string;
    timestamp: number;
}

export type LayoutType = "auto" | "tiled" | "spotlight" | "sidebar";

export interface ParticipantState {
    id: string;
    stream: MediaStream | null;
    isLocal: boolean;
    name: string;
    fullName: string;
    isVideoOff: boolean;
    isMuted: boolean;
    reaction: string | null;
    isHandRaised: boolean;
    isScreenSharing: boolean;
    videoFilter?: string;
    videoBackground?: string;
}

export interface TranscriptEntry {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: number;
}

export interface MeetingAISummary {
    title: string;
    keyPoints: string[];
    actionItems: string[];
    sentiment: string;
    lastUpdated: number;
}

