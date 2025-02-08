import { Project } from "./api/projects/route";
import ProjectGrid from "./components/ProjectGrid";

const HOST_URL = process.env.HOST_URL;

export default async function Home() {
  const response = await fetch(`${HOST_URL}/api/projects`);
  const projects: Project[] = await response.json();

  return <ProjectGrid projects={projects} />;
}
