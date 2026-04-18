import React, { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronDown, Info, Trash2, Check, X, RefreshCw } from "lucide-react";
import AuthContext from "@/contexts/authContext/authContext";
import { updateUser } from "@/utils/api/user/user.api";
import { toast } from "react-toastify";

const SEED_AVATARS = [
    "Garfield", "Felix", "Buster", "Midnight", "Oliver", "Simba", "Mochi", "Coco"
];

export const PersonalInfo: React.FC = () => {
    const { user, setUser } = useContext(AuthContext);
    const [isSaving, setIsSaving] = useState(false);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);

    // Form States
    const [fullName, setFullName] = useState(user?.full_name || "");
    const [profilePicture, setProfilePicture] = useState(user?.profile_picture || "");

    useEffect(() => {
        if (user) {
            setFullName(user.full_name);
            setProfilePicture(user.profile_picture || "");
        }
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            await updateUser({
                userId: user._id || user.id,
                full_name: fullName,
                profile_picture: profilePicture
            });
            // Update local context
            setUser({ ...user, full_name: fullName, profile_picture: profilePicture });
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const selectAvatar = (seed: string) => {
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
        setProfilePicture(avatarUrl);
        setShowAvatarPicker(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
        >
            {/* Header with Save Button */}
            <div className="flex justify-between items-end -mt-10">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold  ">Profile Details</h2>
                    <p className="text-gray-500 text-sm">Update your personal information and photo.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-full text-sm hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-gray-200"
                >
                    {isSaving ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                        <Check className="w-4 h-4" />
                    )}
                    <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </button>
            </div>

            {/* Profile Image Section */}
            <div className="flex items-center space-x-10">
                <div className="relative group">
                    <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-50 border-4 border-white shadow-2xl relative">
                        <img
                            src={profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.full_name}`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                        <div
                            onClick={() => setShowAvatarPicker(true)}
                            className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]"
                        >
                            <Camera className="w-6 h-6 text-white mb-1" />
                            <span className="text-[10px] text-white font-bold uppercase tracking-tighter">Change</span>
                        </div>
                    </div>
                    {/* Floating Status or Icon if needed */}
                </div>

                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-900">Your Avatar</h3>
                    <p className="text-sm text-gray-500 max-w-[240px] leading-relaxed">
                        Pick a fun seed-based avatar or keep your uploaded one.
                    </p>
                    <button
                        onClick={() => setShowAvatarPicker(true)}
                        className="text-xs font-bold text-gray-900 underline underline-offset-4 hover:text-gray-600 transition-colors"
                    >
                        Choose from Library
                    </button>
                </div>

                {/* Avatar Picker Modal/Overlay */}
                <AnimatePresence>
                    {showAvatarPicker && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowAvatarPicker(false)}
                                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-[3rem] shadow-2xl z-[101] w-full max-w-md border border-gray-100"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900">Select Avatar</h3>
                                    <button onClick={() => setShowAvatarPicker(false)} className="p-2 hover:bg-gray-50 rounded-full">
                                        <X className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    {SEED_AVATARS.map((seed) => (
                                        <button
                                            key={seed}
                                            onClick={() => selectAvatar(seed)}
                                            className="group relative"
                                        >
                                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent group-hover:border-gray-900 transition-all">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                                                    alt={seed}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 mt-1 block rounded-full">{seed}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-8">
                <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-900 ml-1">Full Name</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Arafat Nayeem"
                        className="w-full px-6 py-3 bg-gray-300 border border-gray-200 rounded-xl "
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-900 ml-1">Email Address</label>
                    <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="w-full px-6 py-3 bg-gray-300 border border-gray-200 rounded-xl "
                    />
                </div>


            </div>


        </motion.div>
    );
};

