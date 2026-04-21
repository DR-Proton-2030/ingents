"use client";

import React, { useContext, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/screens/layout/Layout";
import useProjects from "@/hooks/useProjects";
import AuthContext from "@/contexts/authContext/authContext";
import { Loading } from "@/components/shared/loadingScreen/Loading";
import { SmartProjectWorkspace } from "./components/SmartProjectWorkspace";

const ProjectWorkspacePage: React.FC = () => {
    const router = useRouter();
    const params = useParams<{ site?: string | string[]; projectId?: string | string[] }>();
    const { user } = useContext(AuthContext);
    const { projects, loading } = useProjects();

    const siteSlug = Array.isArray(params.site) ? params.site[0] : params.site;
    const projectId = Array.isArray(params.projectId) ? params.projectId[0] : params.projectId;

    const project = useMemo(() => {
        if (!projectId) return null;
        return projects.find((item) => item._id === projectId) || null;
    }, [projectId, projects]);

    const handleBack = () => {
        const site = siteSlug || "dashboard";
        router.push(`/${site}/project-management`);
    };

    if (loading) {
        return (
            <Layout showSidebar={true}>
                <Loading />
            </Layout>
        );
    }

    if (!project) {
        return (
            <Layout showSidebar={true}>
                <div className="mx-auto max-w-4xl px-4 py-16 text-center space-y-4">
                    <h1 className="text-2xl font-semibold text-[#1B2B44]">Project not found</h1>
                    <p className="text-sm text-[#5D738E]">
                        This project does not exist or you no longer have access.
                    </p>
                    <button
                        onClick={handleBack}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#1F5FDB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1A4FB7]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to projects
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout showSidebar={true}>


            <SmartProjectWorkspace project={project} userName={user?.full_name} />
        </Layout>
    );
};

export default ProjectWorkspacePage;
