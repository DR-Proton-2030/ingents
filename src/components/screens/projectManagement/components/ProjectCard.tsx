import React from "react";
import { motion } from "framer-motion";

interface ProjectCardProps {
    project: {
        _id: string;
        name: string;
        detail?: string;
    };
    index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
    const logos = [
        "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
        "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
        "https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg",
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="group flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-black/10 rounded-2xl pt-6"
        >
            {/* Folder Shape Container */}
            <div className="relative w-40 h-32 mb-4 transition-transform duration-300 group-hover:-translate-y-1.5">
                {/* Back part of folder */}
                <div className="absolute top-0 right-0 w-full h-[95%] bg-[#4A4B4D] rounded-[1.5rem] shadow-sm">
                    {/* Folder Tab */}
                    <div className="absolute -top-2.5 left-0 w-20 h-8 bg-[#4A4B4D] rounded-t-[1rem]" />
                </div>

                {/* Front part (Flap) of folder */}
                <div className="absolute bottom-0 left-0 w-full h-[88%] bg-[#5E5F61] rounded-[1.5rem] shadow-xl border-t border-white/10 flex items-end p-4 overflow-hidden">
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                    {/* Integration Icons */}
                    <div className="flex -space-x-2.5 relative z-10">
                        {logos.map((url, i) => (
                            <div
                                key={i}
                                className="w-7 h-7 rounded-full bg-white border-2 border-[#5E5F61] flex items-center justify-center overflow-hidden shadow-lg p-1 transition-transform group-hover:scale-110"
                                style={{ transitionDelay: `${i * 40}ms` }}
                            >
                                <img src={url} alt="integration" className="w-full h-full object-contain" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Folder Label */}
            <div className="text-center space-y-0.5">
                <h3 className="text-md  text-[#1A1A1A] tracking-tight  transition-colors">
                    {project.name}
                </h3>

            </div>
        </motion.div>
    );
};


