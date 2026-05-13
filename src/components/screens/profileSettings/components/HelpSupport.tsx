"use client";
import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageCircle,
    ChevronDown,
    ChevronUp,
    Send,
    Mail,
    BookOpen,
    Loader2,
    CheckCircle2,
} from "lucide-react";
import AuthContext from "@/contexts/authContext/authContext";
import { toast } from "react-toastify";

const faqs = [
    {
        q: "How do I invite team members to my workspace?",
        a: "Go to Profile Settings → and use the invite option from the team section. Enter the email addresses of the people you want to invite and they'll receive an email with a join link.",
    },
    {
        q: "How do I upgrade or change my subscription plan?",
        a: "Navigate to Profile Settings → Subscription & Billing. You'll see all available plans and can upgrade or downgrade at any time. Changes take effect immediately.",
    },
    {
        q: "Can I export my data?",
        a: "Yes. Go to Profile Settings → Data & Privacy and use the Export Data option. You'll receive a download link with all your account data in JSON format.",
    },
    {
        q: "How do I connect social media accounts?",
        a: "Go to the Social Media section from the sidebar. Click 'Connect Account' and follow the OAuth flow for each platform (Facebook, Instagram, X, YouTube).",
    },
    {
        q: "What happens to my data if I cancel my subscription?",
        a: "Your data remains accessible on the Free plan. If you choose to delete your account, all data is permanently removed within 30 days per our data retention policy.",
    },
    {
        q: "How do I reset my password?",
        a: "Go to Profile Settings → Emails & Password. Enter your new password and confirm it. If you've forgotten your password, use the 'Forgot Password' link on the login page.",
    },
];

export const HelpSupport: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) {
            toast.error("Please fill in both subject and message.");
            return;
        }

        setIsSending(true);
        try {
            // Open mailto with pre-filled content as the support submission mechanism
            const body = encodeURIComponent(
                `From: ${user?.full_name || "User"} (${user?.email || ""})\n\n${message}`
            );
            const mailtoLink = `mailto:support@ingents.ai?subject=${encodeURIComponent(subject)}&body=${body}`;
            window.location.href = mailtoLink;

            setSent(true);
            setSubject("");
            setMessage("");
            toast.success("Support request opened in your email client.");
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSending(false);
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
                <h2 className="text-xl font-bold">Help & Support</h2>
                <p className="text-gray-500 text-sm">Find answers or get in touch with our support team.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left — Contact Form */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-xl">
                            <MessageCircle className="w-4 h-4 text-blue-600" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">Contact Support</h3>
                    </div>

                    {sent ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center gap-3 py-12 bg-emerald-50 rounded-2xl border border-emerald-100"
                        >
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                            <p className="text-sm font-bold text-emerald-700">Message sent!</p>
                            <p className="text-xs text-emerald-500 text-center max-w-[200px]">
                                We'll get back to you at {user?.email} within 24 hours.
                            </p>
                            <button
                                onClick={() => setSent(false)}
                                className="mt-2 text-xs font-semibold text-emerald-600 underline underline-offset-4"
                            >
                                Send another message
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSendMessage} className="space-y-4">
                            {/* Pre-filled email */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                                    Your Email
                                </label>
                                <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-xl">
                                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="text-sm text-gray-500 font-medium">
                                        {user?.email || "Not logged in"}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="e.g. Issue with billing"
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-200 transition-all text-sm font-medium outline-none"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                                    Message
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Describe your issue in detail..."
                                    rows={5}
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-200 transition-all text-sm font-medium outline-none resize-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSending}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
                            >
                                {isSending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                                {isSending ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    )}
                </div>

                {/* Right — FAQ */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-amber-50 rounded-xl">
                            <BookOpen className="w-4 h-4 text-amber-600" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">Frequently Asked Questions</h3>
                    </div>

                    <div className="space-y-2">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="border border-gray-100 rounded-2xl overflow-hidden bg-white"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-sm font-semibold text-gray-800 pr-4">
                                        {faq.q}
                                    </span>
                                    {openFaq === idx ? (
                                        <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    )}
                                </button>
                                <AnimatePresence>
                                    {openFaq === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
                                                {faq.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
