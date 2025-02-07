import { NextRequest, NextResponse } from "next/server";
import { projects } from "@/app/api/projects/route"
import { getUser } from "@/app/lib/dal";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    const projectId = Number(id);
    const project = projects.find((p) => p.id === projectId);

    if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const applicant = await getUser();
    if (!applicant || !applicant.data?.login) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    if (project.applicants.includes(applicant.data.login)) {
        return NextResponse.json({ error: "Already applied" }, { status: 400 });
    }

    if (!project.applicants.includes(applicant.data.login)) {
        project.applicants.push(applicant.data.login);
    }
    return NextResponse.json(project, { status: 200 });
}