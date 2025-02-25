import { TextEncoder, TextDecoder } from "util";
Object.assign(global, { TextDecoder, TextEncoder });

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Sidebar from "./sidebar";
import { MemoryRouter } from "react-router-dom";

describe("Sidebar component", () => {
  const mockSetIsOpen = jest.fn();
  it("toggle sidebar when button is clicked", () => {
    render(<Sidebar isOpen={false} setIsOpen={mockSetIsOpen} />, {
      wrapper: MemoryRouter,
    });

    expect(screen.getByText("View My Projects")).toBeInTheDocument();
  });

  it("Does not render the sidebar when isOpen is set to false", () => {
    render(<Sidebar isOpen={false} setIsOpen={mockSetIsOpen} />, {
      wrapper: MemoryRouter,
    });
  });

  it("toggles the sub-menu when the button is clicked", async () => {
    render(<Sidebar isOpen={true} setIsOpen={mockSetIsOpen} />, {
      wrapper: MemoryRouter,
    });

    expect(screen.queryByText("Active Projects")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("View My Projects"));

    await waitFor(() => {
      expect(screen.getByText("Active Projects")).toBeInTheDocument();
      expect(screen.getByText("Archived Projects")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("View My Projects"));

    await waitFor(() => {
      expect(screen.queryByText("Active Projects")).not.toBeInTheDocument();
      expect(screen.queryByText("Archived Projects")).not.toBeInTheDocument();
    });
  });

  it("The red ❌ closes the sidebar when clicked", async () => {
    render(<Sidebar isOpen={true} setIsOpen={mockSetIsOpen} />, {
      wrapper: MemoryRouter,
    });

    await waitFor(() => expect(screen.getByText("❌")).toBeInTheDocument());

    fireEvent.click(screen.getByText("❌"));

    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  it("navigates to the 'Active Projects' page when clicked", async () => {
    render(<Sidebar isOpen={true} setIsOpen={mockSetIsOpen} />, {
      wrapper: MemoryRouter,
    });

    fireEvent.click(screen.getByText("View My Projects"));

    fireEvent.click(screen.getByText("Active Projects"));

    await (() => expect(window.location.pathname).toBe("/projects/active"));
  });

  it("navigates to the 'Archived Projects' page when clicked", async () => {
    render(<Sidebar isOpen={true} setIsOpen={mockSetIsOpen} />, {
      wrapper: MemoryRouter,
    });

    fireEvent.click(screen.getByText("View My Projects"));

    fireEvent.click(screen.getByText("Archived Projects"));

    await (() => expect(window.location.pathname).toBe("/projects/archived"));
  });
});
