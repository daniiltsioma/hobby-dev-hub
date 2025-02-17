import { useNavigate, useParams } from "react-router-dom";
import { getUser } from "../lib/user";
import { useEffect, useState } from "react";
import { Project as ProjectInterface } from "../components/projects/ProjectCard";

export default function Project() {
    const { id } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState();
    const [project, setProject] = useState({} as any);
    const navigate = useNavigate();

    async function applyToProject(formData: FormData) {
        const projectId = formData.get("projectId");

        const response = await fetch(
            `${import.meta.env.VITE_EXPRESS_URL}/projects/${projectId}`,
            {
                method: "POST",
            }
        );

        if (response.status === 400) {
            // already applied
            return;
        }

        if (!response.ok) {
            console.error("Failed to apply:", await response.json());
            return;
        }

        const data = await response.json();
        setProject(data);
    }

    useEffect(() => {
        (async function () {
            setIsLoggedIn(await getUser());

            const response = await fetch(
                `${import.meta.env.VITE_EXPRESS_URL}/projects/${id}`,
                {
                    cache: "no-store",
                }
            );

            const proj: ProjectInterface = await response.json();
            if (!proj) {
                navigate("/");
            } else {
                setProject(proj);
            }
        })();
    }, []);

    return (
        <div className="container mx-auto p-8">
            {/* Title and Description Section */}
            <div className="border border-[#3d444d] rounded-lg p-6 mb-6">
                <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
                <p className="text-lg text-[#9198a1]">{project.description}</p>
            </div>
        </div>
    );
}
