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

            {/* Apply Section */}
            <div className="border border-[#3d444d] rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">
                    Collaborate on this Project
                </h2>
                <p className="text-lg text-[#9198a1] mb-4">
                    If you're interested in contributing to this project, please
                    apply below. I'm looking for developers with experience in
                    the technologies listed above.
                </p>
                {isLoggedIn ? (
                    <form action={applyToProject}>
                        <input type="hidden" name="projectId" value={id} />
                        <button
                            type="submit"
                            className="bg-[#212830] hover:bg-[#2f3742] font-medium border border-[#3d444d] rounded-md px-6 py-2"
                        >
                            Apply
                        </button>
                    </form>
                ) : (
                    <p className="font-medium">
                        You must be logged in to apply.
                    </p>
                )}
            </div>
        </div>
    );
}
