import { NextRequest, NextResponse } from "next/server";
import { projects } from "@/app/api/projects/route"

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const projectId = Number(params.id);
    const project = projects.find((p) => p.id === projectId);

    if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const applicant = "New Applicant";

    project.applicants.push(applicant);

    return NextResponse.json(project, { status: 200 });
}