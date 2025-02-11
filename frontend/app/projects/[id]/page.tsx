import { Project as ProjectInterface } from "@/app/api/dummy-db/route";
import { redirect } from "next/navigation";

const HOST_URL = process.env.HOST_URL;

export default async function Project({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = Number((await params).id);
    const response = await fetch(`${HOST_URL}/api/dummy-db/${id}`);
    const project: ProjectInterface = await response.json();
    if (!project) {
        redirect("/");
    }

    return (
        <div className="px-8">
            <div className="text-3xl font-bold">{project.title}</div>
            <div>
                <a
                    href={project.githubRepoURL}
                    className="text-[#4493f8] underline"
                >
                    {project.githubRepoURL}
                </a>
            </div>
            <div>
                <p>{project.description}</p>
            </div>
        </div>
    );
}
