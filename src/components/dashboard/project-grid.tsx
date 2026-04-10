import { ProjectCard } from "@/components/dashboard/project-card";
import type { Project } from "@/types";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </section>
  );
}
