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

    expect(screen.getByText("Collaborations")).toBeInTheDocument();
  });

  it("Does not render the sidebar when isOpen is set to false", () => {
    render(<Sidebar isOpen={false} setIsOpen={mockSetIsOpen} />, {
      wrapper: MemoryRouter,
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
});
