import { useState, useEffect } from "react";
import { Project } from "../../../../backend/src/mongo/projects";
import ProjectCard from "./ProjectCard";

export default function ProjectFilter() {
    const [search, setSearch] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [projects, setProjects] = useState({} as Project[]);

    const availableTags = ["React", "Node.js", "MongoDB", "Python", "NumPy", "C++", "SFML"];

    useEffect(() => {

        if (!search.trim() && tags.length === 0) {
            setProjects([]);
            return;
        }

        const fetchProjects = async () => {
            let queryParams = new URLSearchParams();

            if (search) queryParams.append("search", search);
            if (tags.length) queryParams.append("tags", tags.join(","));

            const response = await fetch(
                `${import.meta.env.VITE_EXPRESS_URL}/dummy-db-search?${queryParams.toString()}`
            );
            const data = await response.json();
            setProjects(data);
        }

        fetchProjects();
    }, [search, tags]);

    return (
        <div className="p-4">
            <input
                type="text"
                placeholder="Search by name"
                className="border p-2 border-[#3d444d] focus:outline-none rounded w-full mb-4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="mb-4">
                <h4 className="font-semibold mb-2">Filter by Tags:</h4>
                <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                        <button
                            key={tag}
                            className={`px-3 py-1 rounded border-[#3d444d] ${tags.includes(tag) ? "bg-white text-[#151b23]" : "bg-[#151b23]"}`}
                            onClick={() =>
                                setTags(tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag])
                            }
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-4">
                {projects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8">
                    {projects.map((project) => (
                        <ProjectCard project={project} key={project.id} />
                    ))}
                    </div>
                ) : (
                    <p>No projects found.</p>
                )}
            </div>
            <div className="h-[2px] bg-[#3d444d] w-full my-4"/>
        </div>
    );
}