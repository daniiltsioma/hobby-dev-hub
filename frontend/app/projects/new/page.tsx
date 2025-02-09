import { redirect } from "next/navigation";

const HOST_URL = process.env.HOST_URL;

export default async function NewProject() {
  async function createProject(formData: FormData) {
    "use server";
    const rawFormData = {
      title: formData.get("title"),
      description: formData.get("description"),
      githubRepoURL: formData.get("githubRepoURL"),
    };

    const response = await fetch(`${HOST_URL}/api/projects/`, {
      method: "POST",
      body: JSON.stringify(rawFormData),
    });
    const project = await response.json();

    if (project) {
      redirect(`/projects/${project.id}`);
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
          className="w-full px-2 py-1 border border-gray-200"
        />
      </label>
      <label className="w-full mb-2">
        <textarea
          name="description"
          placeholder="Project description"
          className="w-full px-2 py-1 border border-gray-200 mb-0"
          rows={6}
        ></textarea>
      </label>
      <label className="w-full mb-2">
        <input
          name="githubRepoURL"
          placeholder="Github repo URL"
          className="w-full px-2 py-1 border border-gray-200"
        ></input>
      </label>
      <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-md mt-2">
        Submit
      </button>
    </form>
  );
}
