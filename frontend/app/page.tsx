import { Project } from "./api/projects/route";
import { getUser } from "./lib/dal";

const HOST_URL = process.env.HOST_URL;

export default async function Home() {
    const user = await getUser();

    const response = await fetch(`${HOST_URL}/api/projects`);
    const projects: Project[] = await response.json();

    return (
        <div className="grid grid-cols-3 gap-4 px-8 mt-12">
            {projects.map((project) => (
                <div className="flex flex-col items-start" key={project.id}>
                    <div className="text-xl font-bold">{project.title}</div>
                    <p>{project.description}</p>
                    <a
                        className="text-blue-900 underline"
                        href={project.githubRepoURL}
                    >
                        Github Repo
                    </a>
                    <a
                        href="#"
                        className="py-1 px-4 text-white bg-blue-600 rounded-md mt-2"
                    >
                        Apply
                    </a>
                </div>
            ))}
        </div>
    );
}
