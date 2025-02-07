import { Project } from "../api/projects/route";
import ProjectCard from "./ProjectCard";

const HOST_URL = process.env.HOST_URL;

export default async function ProjectGrid() {
  const response = await fetch(`${HOST_URL}/api/projects`);
  const projects: Project[] = await response.json();

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          <ProjectCard project={project} key={project.id} />
        ))}
      </div>
    </div>
  );
}
