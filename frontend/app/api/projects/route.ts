import { NextRequest } from "next/server";

export interface Project {
    id: number;
    title: string;
    description: string;
    githubRepoURL: string;
    applicants: string[];
}

export const projects: Project[] = [
    {
        id: 1,
        title: "Project 1",
        description: "Description of project 1",
        githubRepoURL: "https://github.com/daniiltsioma/pizzashop",
        applicants: ["There are no applicants1"],
    },
    {
        id: 2,
        title: "Project 2",
        description: "Description of project 2",
        githubRepoURL: "https://github.com/daniiltsioma/pizzashop",
        applicants: ["There are no applicants2"],
    },
    {
        id: 3,
        title: "Project 3",
        description: "Description of project 3",
        githubRepoURL: "https://github.com/daniiltsioma/pizzashop",
        applicants: ["There are no applicants3"],
    },
];

export async function GET() {
    return Response.json(projects);
}

export async function POST(request: Request) {
    const data = await request.json();

    const project = {
        id: projects.length + 1,
        ...data,
    };

    projects.push(project);

    return Response.json(project);
}
