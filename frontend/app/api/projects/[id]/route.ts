import Project from "@/app/lib/mongo/models/Projects";
import connectToDatabase from "@/app/lib/mongo/dbConnection";
import { cookies } from "next/headers";
import { getUser } from "@/app/lib/dal";
import User from "@/app/lib/mongo/models/Users";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = Number((await params).id);
    const project = Project.findById(id)
        .populate("applicants", "githubId")
        .select("name repoURL description applicants");
    
    if (!project){
        return Response.json({ error: "Project not found"}, {status: 404})
    }

    return Response.json(project);
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

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

    const project = await Project.findById(projectId).populate("applicants"); 

    if (!project) {
        return Response.json({ error: "Project not found" }, { status: 404 });
    }

    if (!applicant || !applicant.data?.login) {
        return Response.json({ error: "User not authenticated" }, { status: 401 });
    }

    if (project.applicants.some((user) => user.githubId === applicant.data.login)) {
        return Response.json({ error: "Already applied" }, { status: 400 });
    }

    const user = await User.findOne({ githubId: applicant.data.login });
    if (!user) {
        return Response.json({ error: "User not found in database" }, { status: 404 });
    }

    project.applicants.push(user);
    await project.save()

    return Response.json(project, { status: 200 });
}
