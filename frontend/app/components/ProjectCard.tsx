import Link from "next/link";
import { Project } from "../api/projects/route";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex flex-col justify-between bg-[#0d1117] border border-[#3d444d] rounded-lg">
      <div className="p-6">
        <h3 className="text-lg font-semibold hover:underline mb-2">
          <Link href={`/projects/${project.id}`}>{project.title}</Link>
        </h3>
        <p className="text-[#9198a1]">{project.description}</p>
      </div>
      <div>
        <div className="px-6 pb-4">
          <a
            className="text-blue-500 hover:underline"
            href={project.githubRepoURL}
          >
            View on GitHub
          </a>
        </div>
        <div className="flex justify-end bg-[#151b23] border-t border-[#3d444d] rounded-b-lg p-4">
          <button className="bg-blue-800 hover:bg-blue-900 font-medium rounded-md py-2 px-4">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
