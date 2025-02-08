import { projects } from "../route";
import { cookies } from "next/headers";
import { getUser } from "@/app/lib/dal";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = Number((await params).id);
    const project = projects.find((proj) => proj.id === id);

    return Response.json(project);
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const projectId = Number((await params).id);
    const project = projects.find((p) => p.id === projectId);

    if (!project) {
        return Response.json({ error: "Project not found" }, { status: 404 });
    }

    const { cookie } = await request.json();
    const cookieStore = await cookies();
    cookieStore.set({
        name: "accessToken",
        value: cookie.value,
        expires: new Date(Date.now() + Number(cookie.expires_in)),
        httpOnly: true,
        path: "/",
    });

    const applicant = await getUser();

    if (!applicant || !applicant.data?.login) {
        return Response.json({ error: "User not authenticated" }, { status: 401 });
    }

    if (project.applicants.includes(applicant.data.login)) {
        return Response.json({ error: "Already applied" }, { status: 400 });
    }

    if (!project.applicants.includes(applicant.data.login)) {
        project.applicants.push(applicant.data.login);
    }
    return Response.json(project, { status: 200 });
}