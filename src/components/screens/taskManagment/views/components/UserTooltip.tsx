"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface UserTooltipProps {
    hoveredUser: { id: string; name: string; rect: DOMRect } | null;
}

const UserTooltip: React.FC<UserTooltipProps> = ({ hoveredUser }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {hoveredUser && (
                <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.9 }}
                    className="fixed z-[999999] px-3 py-2 bg-gray-900 text-white text-[10px] font-bold rounded-xl shadow-2xl pointer-events-none whitespace-nowrap"
                    style={{
                        top: hoveredUser.rect.top - 40,
                        left: hoveredUser.rect.left,
                        transform: "translateX(-50%)",
                    }}
                >
                    {hoveredUser.name}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1.5 border-[6px] border-transparent border-t-gray-900" />
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default UserTooltip;
