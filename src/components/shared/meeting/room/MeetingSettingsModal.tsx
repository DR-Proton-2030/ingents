"use client";
import React from "react";
import { X, Mic, Video, Users, ShieldCheck, Lock, Unlock, Settings2 } from "lucide-react";
import { RoomSettings } from "@/lib/meeting.firebase";

interface MeetingSettingsModalProps {
    settings: RoomSettings;
    onUpdateSettings: (settings: Partial<RoomSettings>) => void;
    onClose: () => void;
    onMuteAll: () => void;
}

const MeetingSettingsModal: React.FC<MeetingSettingsModalProps> = ({
    settings,
    onUpdateSettings,
    onClose,
    onMuteAll
}) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-xl">
                            <Settings2 className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Meeting Settings</h2>
                            <p className="text-xs text-gray-500 font-medium tracking-tight">Host Management Controls</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">
                    {/* Safety Section */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <ShieldCheck className="w-3 h-3" />
                            Safety & Access
                        </div>

                        <div className="space-y-3">
                            {/* Guest Admission */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all">
                                <div className="space-y-0.5">
                                    <p className="text-[13px] font-bold text-gray-900">Direct Guest Admission</p>
                                    <p className="text-[11px] text-gray-500 leading-tight">If OFF, guests must wait for approval to join.</p>
                                </div>
                                <button
                                    onClick={() => onUpdateSettings({ guestAccess: settings.guestAccess === "direct" ? "ask" : "direct" })}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.guestAccess === "direct" ? "bg-orange-500" : "bg-gray-300"}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.guestAccess === "direct" ? "left-7" : "left-1"}`} />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Participant Management */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <Users className="w-3 h-3" />
                            Participant Controls
                        </div>

                        <div className="space-y-3">
                            {/* Mute All Action */}
                            <button
                                onClick={onMuteAll}
                                className="w-full flex items-center justify-between p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 hover:bg-red-100 transition-all"
                            >
                                <div className="text-left space-y-0.5">
                                    <p className="text-[13px] font-bold">Mute Everyone</p>
                                    <p className="text-[11px] opacity-80 leading-tight">Instantly mute all current participants.</p>
                                </div>
                                <Mic className="w-5 h-5" />
                            </button>

                            {/* Camera Lock */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all">
                                <div className="space-y-0.5">
                                    <p className="text-[13px] font-bold text-gray-900">Allow Cameras</p>
                                    <p className="text-[11px] text-gray-500 leading-tight">If OFF, participants cannot enable video.</p>
                                </div>
                                <button
                                    onClick={() => onUpdateSettings({ cameraLock: !settings.cameraLock })}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${!settings.cameraLock ? "bg-orange-500" : "bg-gray-300"}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${!settings.cameraLock ? "left-7" : "left-1"}`} />
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50/50 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-[13px] hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MeetingSettingsModal;
