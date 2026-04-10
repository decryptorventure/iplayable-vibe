"use client";

import { create } from "zustand";
import type { Project } from "@/types";

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  fetchProjects: () => Promise<void>;
  selectProject: (project: Project) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,
  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/projects");
      const projects = (await response.json()) as Project[];
      set({ projects, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
  selectProject: (project) => set({ selectedProject: project })
}));
