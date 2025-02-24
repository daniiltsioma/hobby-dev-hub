import { useParams } from "react-router-dom";
import { getUser } from "../lib/user";
import { useEffect, useState } from "react";

export default function Project() {
    const { id } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState();
    const [project, setProject] = useState({} as any);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        const fetchProject = async () => {
            try {
                const loggedInStatus = await getUser();
                setIsLoggedIn(loggedInStatus);

                const response = await fetch(
                    `${import.meta.env.VITE_EXPRESS_URL}/projects/${id}`
                );
                const data = await response.json();
                setProject(data);
            } catch (err) {
                console.error(err);
                setError("Error fetching project details.");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto p-8">
            {/* Title and Description Section */}
            <div className="border border-[#3d444d] rounded-lg p-6 mb-6">
                <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
                <p className="text-lg text-[#9198a1]">{project.description}</p>
            </div>

            {/* Project Info and Task Section (Horizontal Split) */}
            <div className="flex flex-col lg:flex-row border border-[#3d444d] rounded-lg space-y-6 lg:space-y-0 lg:space-x-6 p-6 mb-6">
                {/* Left Side: Project Info */}
                <div className="flex-1 lg:border-r border-[#3d444d]">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">
                            Project Information
                        </h2>
                        {project.technologies &&
                        project.technologies.length > 0 ? (
                            <div>
                                <h3 className="font-medium text-[#9198a1] mb-1.5">
                                    Technologies Used:
                                </h3>
                                <ul className="flex flex-wrap space-x-2 mb-3">
                                    {project.technologies.map(
                                        (tech: any, idx: any) => (
                                            <li
                                                key={idx}
                                                className="bg-[#2f3742] rounded-full px-3 py-1 mb-2"
                                            >
                                                {tech}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        ) : null}
                        <div>
                            <h3 className="font-medium text-[#9198a1]">
                                Links:
                            </h3>
                            <a
                                href={project.githubRepoURL}
                                className="text-[#4493f8] hover:underline"
                            >
                                GitHub Repository
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right Side: Task */}
                <div className="flex-1 border-t lg:border-none border-[#3d444d] lg:p-0 pt-6">
                    <h2 className="text-2xl font-semibold mb-4">
                        Task Description
                    </h2>
                    <p className="text-lg text-[#9198a1]">
                        {project.task && project.task.length > 0
                            ? project.task
                            : "Check out the GitHub repository for more details and to see how you can contribute!"}
                    </p>
                </div>
            </div>

            {/* Apply Section */}
            <div className="border border-[#3d444d] rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">
                    Collaborate on this Project
                </h2>
                <p className="text-lg text-[#9198a1] mb-4">
                    If you're interested in contributing to this project, please
                    apply below.
                </p>
                {isLoggedIn ? (
                    <form action={applyToProject}>
                        <input type="hidden" name="projectId" value={id} />
                        <button
                            type="submit"
                            className="cursor-pointer bg-[#212830] hover:bg-[#2f3742] font-medium border border-[#3d444d] rounded-md px-6 py-2"
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

            {/* Applicants Section */}
            <div className="border border-[#3d444d] rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Applicants</h2>
                {project.applicants && project.applicants.length > 0 ? (
                    <ul>
                        {project.applicants.map((applicant: any, idx: any) => (
                            <li key={idx} className="text-lg text-[#9198a1]">
                                {applicant}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="font-medium text-[#9198a1]">
                        No applicants yet.
                    </p>
                )}
            </div>
        </div>
    );
}
