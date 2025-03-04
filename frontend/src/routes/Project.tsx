import { useParams } from "react-router-dom";
import { getUser } from "../lib/user";
import { useEffect, useState } from "react";

export default function Project() {
    const { id } = useParams();
    const [username, setUsername] = useState<string | null>(null);
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
                const user = await getUser();
                setUsername(user ? user.login : null);

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

    const approveApplicant = (applicant: string) => {
        // Placeholder logic for approving an applicant
        console.log(`Approving applicant: ${applicant}`);
    };

    const withdrawApplication = () => {
        // Placeholder logic for withdrawing application
        console.log("Withdrawing application...");
    };

    const leaveProject = () => {
        // Placeholder logic for leaving the project
        console.log("Leaving project...");
    };

    // Function to mask the username except for the first character
    const maskUsername = (username: string) => {
        if (username.length > 1) {
            return username[0] + "*".repeat(username.length - 1);
        }
        return username;
    };

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
                <div className="flex justify-between items-start">
                    <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
                    {/* Displayed Status if Archived */}
                    {project.isArchived && (
                        <span className="bg-[#d9534f] text-sm px-3 py-1 rounded-full ml-4">
                            Archived
                        </span>
                    )}
                </div>
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
                {username ? (
                    project.owner === username ? (
                        <p className="font-medium text-[#4CAF50]">
                            You're the owner of this project!
                        </p>
                    ) : project.collaborators?.includes(username) ? (
                        <div className="flex justify-between items-end">
                            <p className="font-medium text-[#4CAF50]">
                                You're already a collaborator on this project!
                            </p>
                            <button
                                onClick={leaveProject}
                                className="cursor-pointer bg-[#c9302c] text-sm px-4 py-2 rounded-md hover:bg-[#9f2a2f] transition-all duration-200 ease-in-out"
                            >
                                Leave Project
                            </button>
                        </div>
                    ) : project.applicants?.includes(username) ? (
                        <div className="flex justify-between items-end">
                            <p className="font-medium text-[#4CAF50]">
                                You've applied to this project!
                            </p>
                            <button
                                onClick={withdrawApplication}
                                className="cursor-pointer bg-[#c9302c] text-sm px-4 py-2 rounded-md hover:bg-[#9f2a2f] transition-all duration-200 ease-in-out"
                            >
                                Withdraw Application
                            </button>
                        </div>
                    ) : (
                        <form action={applyToProject}>
                            <input type="hidden" name="projectId" value={id} />
                            <button
                                type="submit"
                                className="cursor-pointer bg-[#212830] hover:bg-[#2f3742] font-medium border border-[#3d444d] rounded-md px-6 py-2"
                            >
                                Apply
                            </button>
                        </form>
                    )
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
                            <li
                                key={idx}
                                className="flex justify-between items-center text-lg text-[#9198a1] mb-1 hover:bg-[#2f3742] p-1.5 rounded-lg transition-all duration-200"
                            >
                                <span>
                                    {project.owner === username
                                        ? applicant
                                        : maskUsername(applicant)}
                                </span>
                                {project.owner === username && (
                                    <button
                                        onClick={() =>
                                            approveApplicant(applicant)
                                        }
                                        className="cursor-pointer bg-[#4CAF50] text-[#f0f6fc] text-sm px-3 py-1 rounded-md hover:bg-[#45a049] transition-all duration-200 ease-in-out"
                                    >
                                        Approve
                                    </button>
                                )}
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
