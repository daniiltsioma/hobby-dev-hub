import { NextRequest } from "next/server";

export interface Project {
    id: number;
    title: string;
    description: string;
    githubRepoURL: string;
}

export const projects: Project[] = [
    {
        id: 1,
        title: "Project 1",
        description: "Description of project 1",
        githubRepoURL: "https://github.com/daniiltsioma/pizzashop",
    },
    {
        id: 2,
        title: "Project 2",
        description: "Description of project 2",
        githubRepoURL: "https://github.com/daniiltsioma/pizzashop",
    },
    {
        id: 3,
        title: "Project 3",
        description: "Description of project 3",
        githubRepoURL: "https://github.com/daniiltsioma/pizzashop",
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
