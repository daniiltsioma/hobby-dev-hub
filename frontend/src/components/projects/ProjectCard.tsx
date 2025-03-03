import { Link } from "react-router-dom";

export interface Project {
    id: number;
    title: string;
    description: string;
    technologies: string[];
    githubRepoURL: string;
    task: string;
    owner: string;
    applicants: string[];
    collaborators: string[];
    isArchived: boolean;
}

export default function ProjectCard({ project }: { project: Project }) {
    return (
        <div className="flex flex-col justify-between bg-[#0d1117] border border-[#3d444d] rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-semibold hover:underline mb-2">
                    <Link to={`/projects/${project.id}`}>{project.title}</Link>
                </h3>
                <p className="text-[#9198a1]">{project.description}</p>
            </div>
            <div>
                <div className="px-6 pb-4">
                    <a
                        className="text-[#4493f8] hover:underline"
                        href={project.githubRepoURL}
                    >
                        View on GitHub
                    </a>
                </div>
                <div className="flex justify-end bg-[#151b23] border-t border-[#3d444d] rounded-b-lg p-4">
                    <Link
                        to={`/projects/${project.id}`}
                        className="bg-[#212830] hover:bg-[#2f3742] font-medium border border-[#3d444d] rounded-md py-2 px-4 block text-center"
                    >
                        Apply
                    </Link>
                </div>
            </div>
        </div>
    );
}
