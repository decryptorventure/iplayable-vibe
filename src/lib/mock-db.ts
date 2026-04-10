import { mockProjects } from "@/lib/mock-data";
import { mockGeneratedConfig } from "@/lib/openai";
import type { Project } from "@/types";

type VariantRecord = {
  id: string;
  projectId: string;
  name: string;
  config: ReturnType<typeof mockGeneratedConfig>;
  status: "Draft" | "Ready" | "Deployed";
  createdAt: string;
};

const projectsDb: Project[] = [...mockProjects];

const variantsDb: VariantRecord[] = [
  {
    id: "mock-var-1",
    projectId: "proj-water-factory",
    name: "Neon Christmas v1",
    config: mockGeneratedConfig("neon"),
    status: "Draft",
    createdAt: new Date().toISOString()
  }
];

export function listProjects() {
  return projectsDb;
}

export function createProject(payload: { name: string; slug: string; status?: Project["status"] }) {
  const project: Project = {
    id: `proj-${crypto.randomUUID()}`,
    name: payload.name,
    slug: payload.slug,
    status: payload.status ?? "Active",
    totalVariants: 0,
    avgCTR: 0,
    avgCVR: 0,
    totalSpend: 0,
    thumbnail: null
  };
  projectsDb.unshift(project);
  return project;
}

export function listVariantsByProject(projectId: string) {
  return variantsDb
    .filter((variant) => variant.projectId === projectId)
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
}

export function createVariant(payload: {
  projectId: string;
  name: string;
  config: VariantRecord["config"];
  status?: VariantRecord["status"];
}) {
  const variant: VariantRecord = {
    id: `var-${crypto.randomUUID()}`,
    projectId: payload.projectId,
    name: payload.name,
    config: payload.config,
    status: payload.status ?? "Draft",
    createdAt: new Date().toISOString()
  };
  variantsDb.unshift(variant);
  return variant;
}
