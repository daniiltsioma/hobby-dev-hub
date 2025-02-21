import { useNavigate } from "react-router-dom";

export default function NewProject() {
    const navigate = useNavigate();

    async function createProject(formData: FormData) {
        const rawFormData = {
            title: formData.get("title"),
            description: formData.get("description"),
            githubRepoURL: formData.get("githubRepoURL"),
            technologies: [],
            applicants: [],
            task: []
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
            className="w-[400px] flex flex-col items-start px-8 mt-4"
        >
            <label className="w-full mb-2">
                <input
                    name="title"
                    placeholder="Project name"
                    className="w-full bg-[#0d1117] border border-[#3d444d] placeholder-[#9198a1] focus:outline-[#0969da] focus:outline-offset-0 focus:outline-none px-2 py-1"
                />
            </label>
            <label className="w-full mb-2">
                <textarea
                    name="description"
                    placeholder="Project description"
                    className="w-full bg-[#0d1117] border border-[#3d444d] placeholder-[#9198a1] focus:outline-[#0969da] focus:outline-offset-0 focus:outline-none px-2 py-1"
                    rows={6}
                ></textarea>
            </label>
            <label className="w-full mb-2">
                <input
                    name="githubRepoURL"
                    placeholder="Github repo URL"
                    className="w-full bg-[#0d1117] border border-[#3d444d] placeholder-[#9198a1] focus:outline-[#0969da] focus:outline-offset-0 focus:outline-none px-2 py-1"
                ></input>
            </label>
            <button className="bg-blue-600 hover:bg-blue-700 rounded-md mt-2 py-1 px-4">
                Submit
            </button>
        </form>
    );
}
