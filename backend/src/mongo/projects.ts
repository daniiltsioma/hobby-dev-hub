export interface Project {
    id: number;
    title: string;
    description: string;
    technologies: string[];
    githubRepoURL: string;
    task: string;
    applicants: string[];
}

const projects: Project[] = [
    {
        id: 1,
        title: "Project 1",
        description: "Description of project 1",
        technologies: ["React", "Node.js", "MongoDB"],
        githubRepoURL: "https://github.com/daniiltsioma/pizzashop",
        task: "I'm looking for somebody to help implement MongoDB into my project!",
        applicants: [],
    },
    {
        id: 2,
        title: "Project 2",
        description: "Description of project 2",
        technologies: ["Python", "NumPy"],
        githubRepoURL: "https://github.com/daniiltsioma/pizzashop",
        task: "I'm looking for someone to assist with data analytics using Python.",
        applicants: [],
    },
    {
        id: 3,
        title: "Project 3",
        description: "Description of project 3",
        technologies: ["C++", "SFML"],
        githubRepoURL: "https://github.com/daniiltsioma/pizzashop",
        task: "I'm looking for someone with SFML experience to assist in creating a GUI for my app.",
        applicants: [],
    },
];

export default projects;
