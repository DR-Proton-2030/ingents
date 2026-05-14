"use client";
import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Download,
    Trash2,
    ShieldCheck,
    Eye,
    EyeOff,
    AlertTriangle,
    X,
    Loader2,
    Lock,
    FileText,
    CheckCircle2,
} from "lucide-react";
import AuthContext from "@/contexts/authContext/authContext";
import { toast } from "react-toastify";

const privacyPoints = [
    {
        icon: Lock,
        title: "Data Encryption",
        description: "All your data is encrypted at rest and in transit using AES-256 and TLS 1.3.",
    },
    {
        icon: Eye,
        title: "Data Access",
        description: "Only you and authorized team members can access your workspace data.",
    },
    {
        icon: ShieldCheck,
        title: "Compliance",
        description: "We comply with GDPR and applicable data protection regulations.",
    },
    {
        icon: FileText,
        title: "Data Retention",
        description: "Your data is retained for 30 days after account deletion before permanent removal.",
    },
];

export const DataPrivacy: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [exported, setExported] = useState(false);

    // Export real user data from context as a JSON file
    const handleExportData = async () => {
        if (!user) {
            toast.error("No user data found.");
            return;
        }
        setIsExporting(true);
        try {
            const exportPayload = {
                exported_at: new Date().toISOString(),
                profile: {
                    id: user._id || user.id,
                    full_name: user.full_name,
                    email: user.email,
                    role: (user as any).role || null,
                    profile_picture: user.profile_picture || null,
                    has_joined: (user as any).has_joined ?? null,
                    company_object_id: (user as any).company_object_id || null,
                    createdAt: (user as any).createdAt || null,
                },
            };

            const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
                type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `ingents-data-export-${new Date().toISOString().split("T")[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setExported(true);
            setTimeout(() => setExported(false), 4000);
        } catch {
            toast.error("Failed to export data.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== "DELETE") {
            toast.error('Please type "DELETE" to confirm.');
            return;
        }
        setIsDeleting(true);
        try {
            // Send account deletion request via mailto since no delete API exists yet
            const subject = encodeURIComponent("Account Deletion Request");
            const body = encodeURIComponent(
                `User ID: ${user?._id || user?.id}\nEmail: ${user?.email}\nName: ${user?.full_name}\n\nI confirm I want to permanently delete my account and all associated data.`
            );
            window.location.href = `mailto:support@ingents.ai?subject=${subject}&body=${body}`;
            toast.info("Account deletion request sent to support.");
            setShowDeleteModal(false);
            setDeleteConfirmText("");
        } catch {
            toast.error("Failed to send deletion request.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
        >
            {/* Header */}
            <div className="space-y-1 -mt-10">
                <h2 className="text-xl font-bold">Data & Privacy</h2>
                <p className="text-gray-500 text-sm">
                    Control your data, understand how it's used, and manage your account.
                </p>
            </div>

            {/* Privacy Overview */}
            <div className="grid grid-cols-2 gap-4">
                {privacyPoints.map(({ icon: Icon, title, description }) => (
                    <div
                        key={title}
                        className="flex items-start gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors"
                    >
                        <div className="p-2.5 bg-gray-50 rounded-xl flex-shrink-0">
                            <Icon className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">{title}</p>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Your Data */}
            <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900">Your Account Data</h3>
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <tbody>
                            {[
                                { label: "Full Name", value: user?.full_name || "—" },
                                { label: "Email Address", value: user?.email || "—" },
                                { label: "Account ID", value: user?._id || user?.id || "—" },
                                { label: "Role", value: (user as any)?.role || "—" },
                                {
                                    label: "Account Status",
                                    value: (user as any)?.has_joined ? "Active" : "Pending",
                                    badge: true,
                                    active: (user as any)?.has_joined,
                                },
                            ].map(({ label, value, badge, active }, i, arr) => (
                                <tr
                                    key={label}
                                    className={`${i !== arr.length - 1 ? "border-b border-gray-50" : ""}`}
                                >
                                    <td className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-40">
                                        {label}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                        {badge ? (
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${active
                                                        ? "bg-emerald-50 text-emerald-600"
                                                        : "bg-amber-50 text-amber-600"
                                                    }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-amber-500"
                                                        }`}
                                                />
                                                {value}
                                            </span>
                                        ) : (
                                            value
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900">Data Actions</h3>

                <div className="grid grid-cols-1 gap-4">
                    {/* Export */}
                    <div className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="p-2.5 bg-blue-50 rounded-xl flex-shrink-0">
                                <Download className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">Export Your Data</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Download a copy of your profile and account data as a JSON file.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleExportData}
                            disabled={isExporting}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full text-xs font-bold hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ml-4"
                        >
                            {isExporting ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : exported ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                                <Download className="w-3.5 h-3.5" />
                            )}
                            {isExporting ? "Exporting..." : exported ? "Exported!" : "Export"}
                        </button>
                    </div>

                    {/* Delete Account */}
                    <div className="flex items-center justify-between p-5 bg-red-50/50 border border-red-100 rounded-2xl">
                        <div className="flex items-start gap-4">
                            <div className="p-2.5 bg-red-100 rounded-xl flex-shrink-0">
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-red-700">Delete Account</p>
                                <p className="text-xs text-red-400 mt-0.5">
                                    Permanently delete your account and all associated data. This cannot be undone.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 transition-all flex-shrink-0 ml-4"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setShowDeleteModal(false);
                                setDeleteConfirmText("");
                            }}
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                        >
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteConfirmText("");
                                }}
                                className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-red-50">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Delete Account?</h3>
                            </div>

                            <p className="text-sm text-gray-500 mb-5">
                                This will permanently delete your account for{" "}
                                <strong>{user?.email}</strong> and all associated data. This action{" "}
                                <strong>cannot be undone</strong>.
                            </p>

                            <div className="space-y-2 mb-5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Type <span className="text-red-500">DELETE</span> to confirm
                                </label>
                                <input
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    placeholder="DELETE"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono outline-none focus:border-red-300 transition-colors"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeleteConfirmText("");
                                    }}
                                    className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirmText !== "DELETE" || isDeleting}
                                    className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        "Delete Account"
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
