import { useState } from "react";
import { useParams } from "react-router-dom";

type Project = {
    id: string;
    title: string;
    status: "owned" | "applied" | "collaborating";
    description: string;
};

export default function MyProjects() {
    const { username } = useParams();
    const [expandedSections, setExpandedSections] = useState<string[]>([
        "owned",
        "applied",
        "collaborating",
    ]);

    // Dummy data
    const projects: Project[] = [
        {
            id: "1",
            title: "Project One",
            status: "owned",
            description:
                "This is a description of Project One, where I am the owner.",
        },
        {
            id: "2",
            title: "Project Two",
            status: "owned",
            description:
                "This is a description of Project Two, where I am the owner.",
        },
        {
            id: "3",
            title: "Project Three",
            status: "applied",
            description:
                "This is a description of Project Three, where I have applied.",
        },
        {
            id: "4",
            title: "Project Four",
            status: "collaborating",
            description:
                "This is a description of Project Four, where I am collaborating.",
        },
        {
            id: "5",
            title: "Project Five",
            status: "collaborating",
            description:
                "This is a description of Project Five, where I am collaborating.",
        },
        {
            id: "6",
            title: "Project Six",
            status: "applied",
            description:
                "This is a description of Project Six, where I have applied.",
        },
    ];

    const filterProjects = (status: "owned" | "applied" | "collaborating") => {
        return projects.filter((project) => project.status === status);
    };

    const toggleExpand = (category: string) => {
        setExpandedSections(
            (prev) =>
                prev.includes(category)
                    ? prev.filter((item) => item !== category) // If it's already expanded, close it
                    : [...prev, category] // Otherwise, open it
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6">My Projects</h1>

            <div className="border border-[#3d444d] rounded-lg">
                {/* Owned */}
                <div>
                    <button
                        onClick={() => toggleExpand("owned")}
                        className="text-xl font-bold w-full text-left bg-[#151b23] p-3 hover:bg-[#212830] border-b border-[#3d444d] rounded-t-lg"
                    >
                        Owned
                    </button>
                    {expandedSections.includes("owned") && (
                        <div className="">
                            {filterProjects("owned").map((project) => (
                                <div
                                    key={project.id}
                                    className="border-b border-[#3d444d] p-4"
                                >
                                    <h3 className="text-lg font-semibold">
                                        {project.title}
                                    </h3>
                                    <p className="text-[#9198a1]">
                                        {project.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Applied */}
                <div>
                    <button
                        onClick={() => toggleExpand("applied")}
                        className="text-xl font-bold w-full text-left bg-[#151b23] p-3 hover:bg-[#212830] border-b border-[#3d444d]"
                    >
                        Applied
                    </button>
                    {expandedSections.includes("applied") && (
                        <div className="">
                            {filterProjects("applied").map((project) => (
                                <div
                                    key={project.id}
                                    className="border-b border-[#3d444d] p-4"
                                >
                                    <h3 className="text-lg font-semibold">
                                        {project.title}
                                    </h3>
                                    <p className="text-[#9198a1]">
                                        {project.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Collaborating */}
                <div>
                    <button
                        onClick={() => toggleExpand("collaborating")}
                        className={`text-xl font-bold w-full text-left bg-[#151b23] p-3 hover:bg-[#212830] ${
                            expandedSections.includes("collaborating")
                                ? "rounded-none" // No border when expanded
                                : "rounded-b-lg" // Otherwise, apply rounded bottom
                        }`}
                    >
                        Collaborating
                    </button>
                    {expandedSections.includes("collaborating") && (
                        <div className="">
                            {filterProjects("collaborating").map((project) => (
                                <div
                                    key={project.id}
                                    className="border-t border-[#3d444d] p-4"
                                >
                                    <h3 className="text-lg font-semibold">
                                        {project.title}
                                    </h3>
                                    <p className="text-[#9198a1]">
                                        {project.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
