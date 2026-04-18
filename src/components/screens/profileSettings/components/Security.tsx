import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import AuthContext from "@/contexts/authContext/authContext";
import { updateUser } from "@/utils/api/user/user.api";

import { Eye, EyeOff, RefreshCw, Check, Save } from "lucide-react";
import { toast } from "react-toastify";

export const Security: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [isSaving, setIsSaving] = useState(false);

    // Form States
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleUpdatePassword = async () => {
        if (!user) return;
        if (!password) {
            toast.error("Please enter a new password");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsSaving(true);
        try {
            await updateUser({
                userId: user._id || user.id,
                password: password
            });
            toast.success("Password updated successfully!");
            setPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            toast.error(error.message || "Failed to update password");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
        >
            <div className="grid grid-cols-1 gap-8">
                <section className="space-y-8">
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-gray-950">Password Settings</h3>
                        <p className="text-sm text-gray-500">Change your password to keep your account secure.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 max-w-md">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-900 ml-1">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[1.5rem] focus:bg-white focus:border-gray-200 transition-all font-bold"
                                />
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-900 ml-1">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[1.5rem] focus:bg-white focus:border-gray-200 transition-all font-bold"
                            />
                        </div>

                        <button
                            onClick={handleUpdatePassword}
                            disabled={isSaving}
                            className="flex items-center w-56 space-x-2 px-6 py-3 bg-green-600 text-white rounded-full text-sm hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-gray-200"
                        >
                            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>{isSaving ? "Updating..." : "Update Password"}</span>
                        </button>
                    </div>
                </section>


            </div>
        </motion.div>
    );
};

