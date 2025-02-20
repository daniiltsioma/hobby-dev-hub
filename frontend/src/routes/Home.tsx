import { useEffect, useState } from "react";
import ProjectGrid from "../components/projects/ProjectGrid";
import ProjectFilter from "../components/projects/ProjectFilter";

export default function Home() {
    // const [projects, setProjects] = useState([]);

    // useEffect(() => {
    //     async function fetchProjects() {
    //         const apiProjects = await fetch(
    //             `${import.meta.env.VITE_EXPRESS_URL}/dummy-db`
    //         ).then((res) => res.json());
    //         setProjects(apiProjects);
    //     }

    //     fetchProjects();
    // }, []);

    return <ProjectFilter/>
}