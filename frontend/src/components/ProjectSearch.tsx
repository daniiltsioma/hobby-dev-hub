import { useState, useEffect } from "react";
import { Project } from "../../../backend/src/mongo/projects";

export default function ProjectFilter() {
    const [search, setSearch] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [projects, setProjects] = useState({} as Project[]);

    const availableTags = ["React", "Node.js", "MongoDB", "Python", "NumPy", "C++", "SFML"];

    useEffect(() => {
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
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Search & Filter Projects</h2>

            <input
                type="text"
                placeholder="Search by name or description..."
                className="border p-2 rounded w-full mb-4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="mb-4">
                <h4 className="font-semibold mb-2">Filter by Tags:</h4>
                <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                        <button
                            key={tag}
                            className={`px-3 py-1 rounded border ${tags.includes(tag) ? "bg-blue-500 text-white" : "bg-gray-200"}`}
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
                    projects.map((project) => (
                        <div key={project.id} className="border p-4 rounded mb-2">
                            <h3 className="text-xl font-semibold">{project.title}</h3>
                            <p>{project.description}</p>
                            <p><strong>Tags:</strong> {project.technologies.join(", ")}</p>
                        </div>
                    ))
                ) : (
                    <p>No projects found.</p>
                )}
            </div>
        </div>
    );
}