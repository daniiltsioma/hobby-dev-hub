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

        if (!response.ok) {
            console.error("Failed to apply:", await response.json());
            return;
        }

        const data = await response.json();
        navigate(`/projects/${projectId}`);
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
        <div className="px-8">
            <div className="text-3xl font-bold">{project.title}</div>
            <div>
                <a
                    href={project.githubRepoURL}
                    className="text-blue-900 underline"
                >
                    {project.githubRepoURL}
                </a>
            </div>
            <div>
                <p>{project.description}</p>
            </div>
            <div>
                <h5 className="font-semibold">Applicants:</h5>
                <ul className="list-disc pl-5">
                    {project.applicants?.map((applicant: any, index: any) => (
                        <li key={index}>{applicant}</li>
                    ))}
                </ul>
            </div>
            {isLoggedIn ? (
                <form action={applyToProject}>
                    <input type="hidden" name="projectId" value={id} />
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                        disabled={!Array.isArray(project.applicants)}
                    >
                        Apply Now
                    </button>
                </form>
            ) : (
                <p className="mt-4 text-white">
                    You must be logged in to apply
                </p>
            )}
        </div>
    );
}
