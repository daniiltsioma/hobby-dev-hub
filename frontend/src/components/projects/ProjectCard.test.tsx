import { TextEncoder, TextDecoder } from "util";
Object.assign(global, { TextDecoder, TextEncoder }); // polyfill before imports and tests

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import "@testing-library/jest-dom";

const mockProject = {
    id: 1,
    title: "Test Project",
    description: "This is a test project description.",
    technologies: [],
    githubRepoURL: "https://github.com/daniiltsioma/pizzashop",
    task: "This is a test task description.",
    owner: "testUser",
    applicants: [],
    collaborators: [],
};

describe("ProjectCard", () => {
    it("should render project title with link", () => {
        render(
            <MemoryRouter>
                <ProjectCard project={mockProject} />
            </MemoryRouter>
        );

        const titleLink = screen.getByRole("link", { name: mockProject.title });

        expect(titleLink).toBeInTheDocument();
        expect(titleLink).toHaveAttribute(
            "href",
            `/projects/${mockProject.id}`
        );
    });

    it("should render project description", () => {
        render(
            <MemoryRouter>
                <ProjectCard project={mockProject} />
            </MemoryRouter>
        );

        expect(screen.getByText(mockProject.description)).toBeInTheDocument();
    });

    it("should render GitHub link to project repository", () => {
        render(
            <MemoryRouter>
                <ProjectCard project={mockProject} />
            </MemoryRouter>
        );

        const githubLink = screen.getByRole("link", { name: "View on GitHub" });

        expect(githubLink).toBeInTheDocument();
        expect(githubLink).toHaveAttribute("href", mockProject.githubRepoURL);
    });

    it("should navigate to project page when title is clicked", () => {
        render(
            <MemoryRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<ProjectCard project={mockProject} />}
                    />
                    <Route
                        path="/projects/:id"
                        element={<div>Project Details</div>}
                    />
                </Routes>
            </MemoryRouter>
        );

        const titleLink = screen.getByRole("link", {
            name: mockProject.title,
        });

        expect(screen.getByText(mockProject.description)).toBeInTheDocument(); // before click

        fireEvent.click(titleLink);

        expect(screen.getByText("Project Details")).toBeInTheDocument(); // after click
    });

    it("should render Apply button", () => {
        render(
            <MemoryRouter>
                <ProjectCard project={mockProject} />
            </MemoryRouter>
        );

        const applyButton = screen.getByRole("button", { name: "Apply" });

        expect(applyButton).toBeInTheDocument();
    });
});
