"use client";
import { IProject, CreateProjectPayload } from "@/types/interface/project.interface";
import { api } from "@/utils/api";
import { useCallback, useEffect, useState } from "react";

let cachedProjects: IProject[] | null = null;
let isFetching = false;
const listeners: Set<(projects: IProject[]) => void> = new Set();

const useProjects = () => {
    const [projects, setProjects] = useState<IProject[]>(cachedProjects || []);
    const [loading, setLoading] = useState(!cachedProjects);

    const fetchProjects = useCallback(async (force = false) => {
        if (cachedProjects && !force) {
            setProjects(cachedProjects);
            setLoading(false);
            return;
        }

        if (isFetching && !force) {
            listeners.add(setProjects);
            return;
        }

        isFetching = true;
        setLoading(true);
        try {
            const response = await api.project.getProjects();
            cachedProjects = response.data;
            setProjects(response.data);
            listeners.forEach((listener) => listener(response.data));
            listeners.clear();
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        } finally {
            isFetching = false;
            setLoading(false);
        }
    }, []);

    const handleCreateProject = useCallback(async (payload: CreateProjectPayload) => {
        try {
            const response = await api.project.createProject(payload);
            // Refresh cache
            await fetchProjects(true);
            return response.data;
        } catch (error) {
            console.error("Failed to create project:", error);
            throw error;
        }
    }, [fetchProjects]);

    useEffect(() => {
        if (!cachedProjects) {
            listeners.add(setProjects);
        }
        fetchProjects();
        return () => {
            listeners.delete(setProjects);
        };
    }, [fetchProjects]);

    return { projects, loading, fetchProjects, handleCreateProject };
};

export default useProjects;
