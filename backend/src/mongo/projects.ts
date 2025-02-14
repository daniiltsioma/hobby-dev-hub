export interface Project {
    id: number;
    title: string;
    description: string;
    githubRepoURL: string;
    applicants: string[];
}

const projects: Project[] = [
    {
        id: 1,
        title: "Project 1",
        description: "Description of project 1",
        githubRepoURL: "https://github.com/daniiltsioma/pizzashop",
        applicants: [],
    },
    {
        id: 2,
        title: "Project 2",
        description: "Description of project 2",
        githubRepoURL: "https://github.com/daniiltsioma/pizzashop",
        applicants: [],
    },
    {
        id: 3,
        title: "Project 3",
        description: "Description of project 3",
        githubRepoURL: "https://github.com/daniiltsioma/pizzashop",
        applicants: [],
    },
];

export default projects;
