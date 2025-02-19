import ProjectCard, { Project } from "./ProjectCard";
import ProjectFilter from "./ProjectSearch";

export default function ProjectGrid({ projects }: { projects: Project[] }) {
    return (
        <>
            <ProjectFilter/>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8">
                {projects.map((project) => (
                    <ProjectCard project={project} key={project.id} />
                ))}
            </div>
        </>
    );
}
