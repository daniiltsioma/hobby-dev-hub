import { TextEncoder, TextDecoder } from "util";
Object.assign(global, { TextDecoder, TextEncoder }); // polyfill before imports and tests

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import "@testing-library/jest-dom";

const mockProject = {
    id: 1,
    title: "Test Project",
    description: "This is a test project description.",
    githubRepoURL: "https://github.com/daniiltsioma/pizzashop",
    applicants: [],
};

describe("ProjectCard", () => {
    it("should render the project title with link", () => {
        render(
            <MemoryRouter>
                <ProjectCard project={mockProject} />
            </MemoryRouter>
        );

        const titleLink = screen.getByText(mockProject.title);

        expect(titleLink).toBeInTheDocument();
        expect(titleLink).toHaveAttribute(
            "href",
            `/projects/${mockProject.id}`
        );
    });

    it("should render the project description", () => {
        render(
            <MemoryRouter>
                <ProjectCard project={mockProject} />
            </MemoryRouter>
        );

        expect(screen.getByText(mockProject.description)).toBeInTheDocument();
    });
});
