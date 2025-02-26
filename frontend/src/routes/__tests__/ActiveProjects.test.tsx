import { TextEncoder, TextDecoder } from "util";
Object.assign(global, { TextDecoder, TextEncoder });

import { render, screen, waitFor } from "@testing-library/react";
import ActiveProjects from "../ActiveProjects";
import "@testing-library/jest-dom";
import { getUser } from "../../lib/user";
import { useNavigate } from "react-router-dom";
import { MemoryRouter } from "react-router-dom";

beforeEach(() => {
  process.env.TEST_ENV = "true";
});

afterEach(() => {
  process.env.TEST_ENV = "false";
});

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation((message) => {
    throw new Error(message);
  });
});

jest.mock("../../lib/user", () => ({
  getUser: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("ActiveProjects Route", () => {
  let mockNavigate;

  beforeEach(() => {
    jest.resetAllMocks();
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            activeProjects: [{ name: "Active Project 1" }],
            archivedProjects: [{ name: "Archived Project 1" }],
          }),
      } as unknown as Response)
    );
  });

  it("renders user's active projects when user is found", async () => {
    (getUser as jest.Mock).mockResolvedValueOnce({ login: "obi" });

    render(<ActiveProjects />, { wrapper: MemoryRouter });

    await waitFor(() => screen.getByText("obi's Active Projects"));
    expect(screen.getByText("obi's Active Projects")).toBeInTheDocument();
  });

  it("handles errors when fetching projects", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      } as unknown as Response)
    );

    (getUser as jest.Mock).mockResolvedValueOnce({ login: "obi" });

    render(<ActiveProjects />, { wrapper: MemoryRouter });

    await waitFor(() => screen.getByText("Error: could not load projects."));
    expect(
      screen.getByText("Error: could not load projects.")
    ).toBeInTheDocument();
  });

  it("displays error message when user is not found", async () => {
    (getUser as jest.Mock).mockResolvedValueOnce(null);

    render(<ActiveProjects />, { wrapper: MemoryRouter });

    await waitFor(() => screen.getByText("User not found"));
    expect(screen.getByText("User not found")).toBeInTheDocument();
  });
});
