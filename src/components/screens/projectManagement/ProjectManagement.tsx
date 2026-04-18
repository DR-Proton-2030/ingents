"use client";
import React, { useState } from "react";
import Layout from "@/screens/layout/Layout";
import useProjects from "@/hooks/useProjects";
import { Loading } from "@/components/shared/loadingScreen/Loading";
import { CreateProjectDrawer } from "@/components/screens/taskManagment/components";
import { ProjectHeader, ProjectCard, EmptyState } from "./components";

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
                <ProjectHeader
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onAddProject={() => setIsCreateDrawerOpen(true)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {filteredProjects.map((project, index) => (
                        <ProjectCard key={project._id} project={project} index={index} />
                    ))}

                    {filteredProjects.length === 0 && (
                        <EmptyState
                            searchQuery={searchQuery}
                            onAddProject={() => setIsCreateDrawerOpen(true)}
                        />
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

