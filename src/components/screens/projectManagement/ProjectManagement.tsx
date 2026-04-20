"use client";
import React, { useCallback, useMemo, useState } from "react";
import Layout from "@/screens/layout/Layout";
import useProjects from "@/hooks/useProjects";
import { Loading } from "@/components/shared/loadingScreen/Loading";
import { CreateProjectDrawer } from "@/components/screens/taskManagment/components";
import { useParams, useRouter } from "next/navigation";
import { ProjectHeader, ProjectCard, EmptyState } from "./components";

const ProjectManagement: React.FC = () => {
    const router = useRouter();
    const params = useParams<{ site?: string | string[] }>();
    const { projects, loading, handleCreateProject } = useProjects();
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
    const siteSlug = Array.isArray(params.site) ? params.site[0] : params.site;

    const filteredProjects = useMemo(
        () =>
            projects.filter((p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        [projects, searchQuery]
    );

    const handleOpenProject = useCallback(
        (projectId: string) => {
            const site = siteSlug || "dashboard";
            router.push(`/${site}/project-management/${projectId}`);
        },
        [router, siteSlug]
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
                        <ProjectCard
                            key={project._id}
                            project={project}
                            index={index}
                            onSelect={handleOpenProject}
                        />
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

