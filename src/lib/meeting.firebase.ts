import { 
    doc, 
    setDoc, 
    deleteDoc, 
    collection, 
    onSnapshot, 
    updateDoc, 
    serverTimestamp,
    query,
    where,
    getDocs,
    writeBatch
} from "firebase/firestore";
import { db } from "./firebase";

export interface FirebaseParticipant {
    peerId: string;
    userId: string;
    userName: string;
    isVideoOff: boolean;
    isMuted: boolean;
    isScreenSharing: boolean;
    isHandRaised: boolean;
    lastSeen: any;
    joinedAt: any;
    status: "active" | "waiting" | "denied";
}

export interface RoomSettings {
    muteAll: boolean;
    cameraLock: boolean;
    guestAccess: "direct" | "ask";
}

const ROOMS_COLLECTION = "meeting_rooms";

export const joinMeetingRoom = async (meetingCode: string, participant: FirebaseParticipant) => {
    const participantDoc = doc(db, ROOMS_COLLECTION, meetingCode, "participants", participant.peerId);
    await setDoc(participantDoc, {
        ...participant,
        joinedAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
    });
};

export const updateParticipantPresence = async (meetingCode: string, peerId: string) => {
    const participantDoc = doc(db, ROOMS_COLLECTION, meetingCode, "participants", peerId);
    await updateDoc(participantDoc, {
        lastSeen: serverTimestamp(),
    });
};

export const updateParticipantMedia = async (
    meetingCode: string, 
    peerId: string, 
    updates: Partial<Pick<FirebaseParticipant, "isVideoOff" | "isMuted" | "isHandRaised" | "isScreenSharing">>
) => {
    const participantDoc = doc(db, ROOMS_COLLECTION, meetingCode, "participants", peerId);
    await updateDoc(participantDoc, updates);
};

export const leaveMeetingRoom = async (meetingCode: string, peerId: string) => {
    const participantDoc = doc(db, ROOMS_COLLECTION, meetingCode, "participants", peerId);
    await deleteDoc(participantDoc);
};

export const listenToParticipants = (
    meetingCode: string, 
    callback: (participants: FirebaseParticipant[]) => void
) => {
    const participantsCol = collection(db, ROOMS_COLLECTION, meetingCode, "participants");
    return onSnapshot(participantsCol, (snapshot) => {
        const participants = snapshot.docs.map(doc => doc.data() as FirebaseParticipant);
        callback(participants);
    });
};

export const pruneStaleParticipants = async (meetingCode: string) => {
    const participantsCol = collection(db, ROOMS_COLLECTION, meetingCode, "participants");
    const now = Date.now();
    const staleThreshold = 30000; // 30 seconds

    const snapshot = await getDocs(participantsCol);
    const batch = writeBatch(db);
    let hasStale = false;

    snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const lastSeen = data.lastSeen?.toMillis() || 0;
        if (now - lastSeen > staleThreshold) {
            batch.delete(doc.ref);
            hasStale = true;
        }
    });

    if (hasStale) {
        await batch.commit();
    }
};

// --- Room Settings ---
export const updateRoomSettings = async (meetingCode: string, settings: Partial<RoomSettings>) => {
    const roomDoc = doc(db, ROOMS_COLLECTION, meetingCode);
    await setDoc(roomDoc, { settings }, { merge: true });
};

export const listenToRoomSettings = (
    meetingCode: string,
    callback: (settings: RoomSettings) => void
) => {
    const roomDoc = doc(db, ROOMS_COLLECTION, meetingCode);
    return onSnapshot(roomDoc, (doc) => {
        const data = doc.data();
        if (data?.settings) {
            callback(data.settings as RoomSettings);
        }
    });
};

// --- Guest Admission ---
export const requestToJoin = async (meetingCode: string, participant: FirebaseParticipant) => {
    const queueDoc = doc(db, ROOMS_COLLECTION, meetingCode, "waiting_queue", participant.peerId);
    await setDoc(queueDoc, {
        ...participant,
        status: "waiting",
        requestedAt: serverTimestamp()
    });
};

export const handleAdmission = async (meetingCode: string, peerId: string, status: "active" | "denied") => {
    const queueDoc = doc(db, ROOMS_COLLECTION, meetingCode, "waiting_queue", peerId);
    if (status === "denied") {
        await updateDoc(queueDoc, { status: "denied" });
    } else {
        // If admitted, we move them to participants and remove from queue
        // (Wait, we can just update status in queue and the client will move themselves)
        await updateDoc(queueDoc, { status: "active" });
    }
};

export const listenToWaitlist = (
    meetingCode: string,
    callback: (participants: FirebaseParticipant[]) => void
) => {
    const queueCol = collection(db, ROOMS_COLLECTION, meetingCode, "waiting_queue");
    const q = query(queueCol, where("status", "==", "waiting"));
    return onSnapshot(q, (snapshot) => {
        const participants = snapshot.docs.map(doc => doc.data() as FirebaseParticipant);
        callback(participants);
    });
};

export const listenToAdmissionStatus = (
    meetingCode: string,
    peerId: string,
    callback: (status: "waiting" | "active" | "denied") => void
) => {
    const queueDoc = doc(db, ROOMS_COLLECTION, meetingCode, "waiting_queue", peerId);
    return onSnapshot(queueDoc, (doc) => {
        const data = doc.data();
        if (data?.status) {
            callback(data.status);
        }
    });
};
