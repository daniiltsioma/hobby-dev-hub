import Link from "next/link";
import { Project } from "./api/projects/route";
import { getUser } from "./lib/dal";
import UserHeader from "./components/header/userHeader";
import ProjectGrid from "./components/ProjectGrid";

const HOST_URL = process.env.HOST_URL;

export default async function Home() {
    const user = await getUser();

    const response = await fetch(`${HOST_URL}/api/projects`);
    const projects: Project[] = await response.json();

    return (
        <ProjectGrid projects={projects} />
    );
}
