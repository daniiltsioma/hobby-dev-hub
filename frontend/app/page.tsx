import Link from "next/link";
import { Project } from "./api/projects/route";
import { getUser } from "./lib/dal";
import UserHeader from "./components/header/userHeader";

const HOST_URL = process.env.HOST_URL;

export default async function Home() {
    const user = await getUser();

    const response = await fetch(`${HOST_URL}/api/projects`);
    const projects: Project[] = await response.json();

    return (
        <div className="grid grid-cols-3 gap-4 px-8 mt-12">
            {projects.map((project) => (
                <div className="flex flex-col items-start" key={project.id}>
                    <div className="text-xl font-bold">
                        <Link href={`/projects/${project.id}`}>
                            {project.title}
                        </Link>
                    </div>
                    <p>{project.description}</p>
                    <a
                        className="text-blue-900 underline"
                        href={project.githubRepoURL}
                    >
                        Github Repo
                    </a>
                </div>
            ))}
        </div>
    );
}
