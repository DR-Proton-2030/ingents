"use client";
import React, { useState } from "react";
import Layout from "@/screens/layout/Layout";
import { Folder, AddCircle, Magnifer, Document, User } from "@solar-icons/react";
import { motion } from "framer-motion";
import useProjects from "@/hooks/useProjects";
import { Loading } from "@/components/shared/loadingScreen/Loading";
import { CreateProjectDrawer } from "@/components/screens/taskManagment/components";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";

const ProjectManagement: React.FC = () => {
    const { projects, loading, handleCreateProject } = useProjects();
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

    const filteredProjects = projects.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <Layout showSidebar={true}>
                <Loading />
            </Layout>
        );
    }

    return (
        <Layout showSidebar={true}>
            <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-end gap-6">


                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Magnifer className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm w-full md:w-80 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 shadow-sm transition-all placeholder:text-gray-400 placeholder:font-medium"
                            />
                        </div>

                        <button
                            onClick={() => setIsCreateDrawerOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
                        >
                            <AddCircle className="w-5 h-5 text-white" />
                            <span>Create Project</span>
                        </button>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={project._id}
                            className="group bg-white border border-gray-100 p-6 rounded-[2rem] hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/5 transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-500">
                                        <Folder className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                                        <MoreHorizontal className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>

                                <div className="space-y-2 mb-3">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed min-h-[40px]">
                                        {project.detail || "No description provided for this project."}
                                    </p>
                                </div>

                                <div className="mt-auto pt- border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center -space-x-2">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                                                <User className="w-4 h-4 text-gray-400" />
                                            </div>
                                        ))}
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600">
                                            +5
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        <Document className="w-4 h-4" />
                                        <span>Tasks</span>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Background Gradient */}
                            <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
                        </motion.div>
                    ))}

                    {/* Empty State */}
                    {filteredProjects.length === 0 && (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
                            <div className="p-6 bg-white rounded-full shadow-sm">
                                <Folder className="w-12 h-12 text-gray-300" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">No projects found</h3>
                                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                                    {searchQuery ? "Try searching for something else or clear the search." : "Start by creating your first team workspace."}
                                </p>
                            </div>
                            {!searchQuery && (
                                <button
                                    onClick={() => setIsCreateDrawerOpen(true)}
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all"
                                >
                                    Create First Project
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <CreateProjectDrawer
                    isOpen={isCreateDrawerOpen}
                    onClose={() => setIsCreateDrawerOpen(false)}
                    onSubmit={async (data) => {
                        await handleCreateProject(data);
                    }}
                />
            </div>
        </Layout>
    );
};

export default ProjectManagement;
