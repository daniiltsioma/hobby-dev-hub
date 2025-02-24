export interface Project {
    id: number;
    title: string;
    description: string;
    technologies: string[];
    githubRepoURL: string;
    task: string;
    owner: string;
    applicants: string[];
    collaborators: string[];
}

const projects: Project[] = [
    {
        id: 1,
        title: "Project 1",
        description: "Description of project 1",
        technologies: ["React", "Node.js", "MongoDB"],
        githubRepoURL: "https://github.com/daniiltsioma/pizzashop",
        task: "I'm looking for somebody to help implement MongoDB into my project!",
        owner: "daniiltsioma",
        applicants: [],
        collaborators: ["lbrescia", "andrespdx"],
    },
    {
        id: 2,
        title: "Project 2",
        description: "Description of project 2",
        technologies: ["Python", "NumPy", "Pandas"],
        githubRepoURL: "https://github.com/daniiltsioma/pizzashop",
        task: "I'm looking for someone to assist with data analytics using Python.",
        owner: "andrespdx",
        applicants: [],
        collaborators: ["nvenetucci", "daniiltsioma"],
    },
    {
        id: 3,
        title: "Project 3",
        description: "Description of project 3",
        technologies: ["C++", "SFML"],
        githubRepoURL: "https://github.com/daniiltsioma/pizzashop",
        task: "I'm looking for someone with SFML experience to assist in creating a GUI for my app.",
        owner: "lbrescia",
        applicants: [],
        collaborators: ["andrespdx", "nvenetucci"],
    },
    {
        id: 4,
        title: "Project 4",
        description: "Description of project 4",
        technologies: ["C"],
        githubRepoURL: "https://github.com/daniiltsioma/pizzashop",
        task: "I’m looking for someone to help me complete my calculator app!",
        owner: "nvenetucci",
        applicants: [],
        collaborators: ["daniiltsioma", "lbrescia"],
    },
];

export default projects;
