import { TextEncoder, TextDecoder } from "util";
Object.assign(global, { TextDecoder, TextEncoder });

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ActiveProjects from "../ActiveProjects";
import "@testing-library/jest-dom";
import { getUser } from "../../lib/user";
import { useNavigate } from "react-router-dom";
import { MemoryRouter } from "react-router-dom";

//console.log(ActiveProjects);

jest.mock("../../lib/user", () => ({
  getUser: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () =>
      Promise.resolve({
        activeProjects: [{ name: "Active Project 1" }],
        archivedProjects: [{ name: "Archived Project 1" }],
      }),
    headers: {
      get: () => null,
    },
  } as unknown as Response)
);

describe("ActiveProjects Route", () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    // Resetting mocks before each test
    mockNavigate = useNavigate() as jest.Mock;
  });

  it("", async () => {
    (getUser as jest.Mock).mockResolvedValueOnce({ login: "obi" });

    render(<ActiveProjects />, {
      wrapper: MemoryRouter,
    });

    await waitFor(() => screen.getByText("Hi Obi"));
    expect(screen.getByText("Hi Obi")).toBeInTheDocument();
  });

  it("handles errors when fetching projects", async () => {
    // Mock an error response for fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false, // Simulating an error response
        status: 500,
        json: () => Promise.resolve({}),
      } as unknown as Response)
    );

    (getUser as jest.Mock).mockResolvedValueOnce({ login: "obi" });

    render(<ActiveProjects />, {
      wrapper: MemoryRouter,
    });

    await waitFor(() => screen.getByText("Error: could not load projects."));
    expect(
      screen.getByText("Error: could not load projects.")
    ).toBeInTheDocument();
  });

  it("displays error message when user is not found", async () => {
    (getUser as jest.Mock).mockResolvedValueOnce(null);

    render(<ActiveProjects />, {
      wrapper: MemoryRouter,
    });

    await waitFor(() =>
      expect(screen.getByText("User not found")).toBeInTheDocument()
    );
  });
});
