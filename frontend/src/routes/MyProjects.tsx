import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Project } from "../components/projects/ProjectCard";
import { getUser } from "../lib/user";

export default function MyProjects() {
    const [username, setUsername] = useState();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedSections, setExpandedSections] = useState<string[]>([
        "owned",
        "applied",
        "collaborating",
        "archived",
    ]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const user = await getUser();
                setUsername(user ? user.login : null);

                const response = await fetch(
                    `${import.meta.env.VITE_EXPRESS_URL}/dummy-db`
                );
                const data = await response.json();
                setProjects(data);
            } catch (err) {
                console.error(err);
                setError("Error fetching projects.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Placeholder action for Inactivating a project
    const handleInactivate = (projectId: number) => {
        console.log(`Project with ID: ${projectId} has been inactivated.`);
    };

    // Placeholder action for Deleting a project
    const handleDelete = (projectId: number) => {
        console.log(`Project with ID: ${projectId} has been deleted.`);
    };

    const filterProjects = (
        status: "owned" | "applied" | "collaborating" | "archived"
    ) => {
        if (!username) return [];

        switch (status) {
            case "owned":
                return projects.filter((project) => project.owner === username);
            case "applied":
                return projects.filter(
                    (project) => project.applicants?.includes(username) ?? false
                );
            case "collaborating":
                return projects.filter(
                    (project) =>
                        project.collaborators?.includes(username) ?? false
                );
            case "archived":
                return projects.filter((project) => project.isArchived);
            default:
                return [];
        }
    };

    const toggleExpand = (category: string) => {
        setExpandedSections(
            (prev) =>
                prev.includes(category)
                    ? prev.filter((item) => item !== category) // If it's already expanded, close it
                    : [...prev, category] // Otherwise, open it
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!username) {
        return <div>You must be logged in to access your projects.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-8">
            <h1 className="text-3xl font-semibold mb-6">My Projects</h1>

            <div className="border border-[#3d444d] rounded-lg">
                {/* Owned */}
                <div>
                    <button
                        onClick={() => toggleExpand("owned")}
                        className="text-xl font-bold w-full text-left bg-[#151b23] hover:bg-[#212830] border-b border-[#3d444d] rounded-t-lg p-4"
                    >
                        Owned
                    </button>
                    {expandedSections.includes("owned") && (
                        <div className="">
                            {filterProjects("owned").length === 0 ? (
                                <p className="text-[#9198a1] border-b border-[#3d444d] p-4">
                                    You don't own any projects yet.
                                </p>
                            ) : (
                                filterProjects("owned").map((project) => (
                                    <div
                                        key={project.id}
                                        className="border-b border-[#3d444d] p-4 flex"
                                    >
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold hover:opacity-80 mb-1">
                                                <Link
                                                    to={`/projects/${project.id}`}
                                                >
                                                    {project.title}
                                                </Link>
                                            </h3>
                                            <p className="text-[#9198a1]">
                                                {project.description}
                                            </p>
                                        </div>

                                        <div className="flex flex-col justify-between items-end ml-4">
                                            {/* Status Pill */}
                                            <span className="text-xs bg-[#2f3742] rounded-full py-1 px-2">
                                                Owner
                                            </span>

                                            {/* Archive Button */}
                                            <button
                                                onClick={() =>
                                                    handleInactivate(project.id)
                                                }
                                                className="text-sm text-[#e74c3c] hover:text-[#c0392b] cursor-pointer"
                                            >
                                                Archive
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Applied */}
                <div>
                    <button
                        onClick={() => toggleExpand("applied")}
                        className="text-xl font-bold w-full text-left bg-[#151b23] hover:bg-[#212830] border-b border-[#3d444d] p-4"
                    >
                        Applied
                    </button>
                    {expandedSections.includes("applied") && (
                        <div className="">
                            {filterProjects("applied").length === 0 ? (
                                <p className="text-[#9198a1] border-b border-[#3d444d] p-4">
                                    You haven't applied to any projects yet.
                                </p>
                            ) : (
                                filterProjects("applied").map((project) => (
                                    <div
                                        key={project.id}
                                        className="border-b border-[#3d444d] p-4 flex"
                                    >
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold hover:opacity-80 mb-1">
                                                <Link
                                                    to={`/projects/${project.id}`}
                                                >
                                                    {project.title}
                                                </Link>
                                            </h3>
                                            <p className="text-[#9198a1]">
                                                {project.description}
                                            </p>
                                        </div>

                                        <div className="flex flex-col justify-between items-end ml-4">
                                            {/* Status Pill */}
                                            <span className="text-xs bg-[#2f3742] rounded-full py-1 px-2">
                                                Applicant
                                            </span>

                                            {/* Withdraw Button */}
                                            <button
                                                onClick={() =>
                                                    handleInactivate(project.id)
                                                }
                                                className="text-sm text-[#e74c3c] hover:text-[#c0392b] cursor-pointer"
                                            >
                                                Withdraw
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Collaborating */}
                <div>
                    <button
                        onClick={() => toggleExpand("collaborating")}
                        className={`text-xl font-bold w-full text-left bg-[#151b23] hover:bg-[#212830] border-b border-[#3d444d] p-4`}
                    >
                        Collaborating
                    </button>
                    {expandedSections.includes("collaborating") && (
                        <div className="">
                            {filterProjects("collaborating").length === 0 ? (
                                <p className="text-[#9198a1] border-b border-[#3d444d] p-4">
                                    You're not collaborating on any projects
                                    yet.
                                </p>
                            ) : (
                                filterProjects("collaborating").map(
                                    (project) => (
                                        <div
                                            key={project.id}
                                            className="border-b border-[#3d444d] p-4 flex"
                                        >
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold hover:opacity-80 mb-1">
                                                    <Link
                                                        to={`/projects/${project.id}`}
                                                    >
                                                        {project.title}
                                                    </Link>
                                                </h3>
                                                <p className="text-[#9198a1]">
                                                    {project.description}
                                                </p>
                                            </div>

                                            <div className="flex flex-col justify-between items-end ml-4">
                                                {/* Status Pill */}
                                                <span className="text-xs bg-[#2f3742] rounded-full py-1 px-2">
                                                    Collaborator
                                                </span>

                                                {/* Leave Button */}
                                                <button
                                                    onClick={() =>
                                                        handleInactivate(
                                                            project.id
                                                        )
                                                    }
                                                    className="text-sm text-[#e74c3c] hover:text-[#c0392b] cursor-pointer"
                                                >
                                                    Leave
                                                </button>
                                            </div>
                                        </div>
                                    )
                                )
                            )}
                        </div>
                    )}
                </div>

                {/* Inactive */}
                <div>
                    <button
                        onClick={() => toggleExpand("archived")}
                        className={`text-xl font-bold w-full text-left bg-[#151b23] hover:bg-[#212830] p-4 ${
                            expandedSections.includes("archived")
                                ? "rounded-none" // Not rounded when expanded
                                : "rounded-b-lg" // Otherwise, apply rounded bottom
                        }`}
                    >
                        Inactive
                    </button>
                    {expandedSections.includes("archived") && (
                        <div className="">
                            {filterProjects("archived").length === 0 ? (
                                <p className="text-[#9198a1] border-t border-[#3d444d] p-4">
                                    You don't have any inactive projects yet.
                                </p>
                            ) : (
                                filterProjects("archived").map((project) => (
                                    <div
                                        key={project.id}
                                        className="border-t border-[#3d444d] p-4 flex"
                                    >
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold hover:opacity-80 mb-1">
                                                <Link
                                                    to={`/projects/${project.id}`}
                                                >
                                                    {project.title}
                                                </Link>
                                            </h3>
                                            <p className="text-[#9198a1]">
                                                {project.description}
                                            </p>
                                        </div>

                                        <div className="flex flex-col justify-between items-end ml-4">
                                            {/* Status Pill */}
                                            <span className="text-xs bg-[#2f3742] rounded-full py-1 px-2">
                                                Owner/Applicant/Collaborator
                                            </span>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() =>
                                                    handleDelete(project.id)
                                                }
                                                className="text-sm text-[#e74c3c] hover:text-[#c0392b] cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
