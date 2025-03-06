import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewProject() {
    const navigate = useNavigate();

    const [tags, setTags] = useState<string[]>([]);
    const availableTags = ["React", "Node.js", "MongoDB", "Python", "NumPy", "C++", "SFML"];

    async function createProject(formData: FormData) {
        const rawFormData = {
            title: formData.get("title"),
            description: formData.get("description"),
            githubRepoURL: formData.get("githubRepoURL"),
            technologies: tags,
            applicants: [],
            task: formData.get("task")
        };

        console.log(JSON.stringify(rawFormData));

        const response = await fetch(
            `${import.meta.env.VITE_EXPRESS_URL}/dummy-db`,
            {
                method: "POST",
                body: JSON.stringify(rawFormData),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const project = await response.json();

        if (project) {
            navigate(`/projects/${project.id}`);
        }
    }

    return (
        <form
            action={createProject}
            className="w-[625px] flex flex-col items-start px-8 mt-4"
        >
            <div className="font-semibold text-4xl mb-2">
                Post a Project
            </div>
            <label className="w-full mb-2 text-xl">
                <input
                    name="title"
                    placeholder="Project name"
                    className="w-full bg-[#0d1117] border border-[#3d444d] placeholder-[#9198a1] focus:outline-[#0969da] focus:outline-offset-0 focus:outline-none px-2 py-1 rounded w-full"
                />
            </label>
            <label className="w-full mb-2">
                <textarea
                    name="description"
                    placeholder="Project description"
                    className="w-full bg-[#0d1117] border border-[#3d444d] placeholder-[#9198a1] focus:outline-[#0969da] focus:outline-offset-0 focus:outline-none px-2 py-1 rounded w-full resize-none"
                    rows={6}
                ></textarea>
            </label>
            <label className="w-full mb-2">
                <input
                    name="githubRepoURL"
                    placeholder="Github repo URL"
                    className="w-full bg-[#0d1117] border border-[#3d444d] placeholder-[#9198a1] focus:outline-[#0969da] focus:outline-offset-0 focus:outline-none px-2 py-1 rounded w-full"
                ></input>
            </label>
            <label className="w-full mb-2">
                <textarea
                    name="task"
                    placeholder="Project Task"
                    className="w-full bg-[#0d1117] border border-[#3d444d] placeholder-[#9198a1] focus:outline-[#0969da] focus:outline-offset-0 focus:outline-none px-2 py-1 rounded w-full resize-none"
                ></textarea>
            </label>

            <div className="mb-4">
                <h4 className="font-semibold mb-2">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                        <button
                            key={tag}
                            className={`px-3 py-1 cursor-pointer rounded border-[#3d444d] ${tags.includes(tag) ? "bg-white text-[#151b23]" : "bg-[#151b23]"}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setTags(tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag])
                            }}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 rounded-md mt-2 py-1 px-4">
                Submit
            </button>
        </form>
    );
}
