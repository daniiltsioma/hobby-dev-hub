import { Project as ProjectInterface } from "@/app/api/projects/route";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const HOST_URL = process.env.HOST_URL

async function applyToProject(formData: FormData) {
    "use server";
    const  projectId = formData.get("projectId")
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");

    const response = await fetch(`${HOST_URL}/api/projects/${projectId}`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ cookie: accessToken}) 
    });

    if (!response.ok) {
        console.error("Failed to apply:", await response.json());
        return;
    }
    redirect(`/projects/${projectId}`)
}

export default async function Project({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = Number((await params).id);
    const response = await fetch(`${HOST_URL}/api/projects/${id}`, {
        cache: "no-store",
    });
    const project: ProjectInterface = await response.json();
    if (!project) {
        redirect("/");
    }

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
                    {project.applicants.length > 0 ? (
                        project.applicants.map((applicant, index) => (
                            <li key={index}>{applicant}</li>
                        ))
                    ) : (
                        <p>No applicants yet.</p>
                    )}
                </ul>
            </div>
            <form action={applyToProject}>
                <input type="hidden" name="projectId" value={id} />
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Apply Now
                </button>
            </form>
        </div>
    );
}
