import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Sidebar from "./sidebar";
import { TextEncoder } from "util";
global.TextEncoder = TextEncoder;
import { MemoryRouter } from "react-router-dom";

it("toggle sidebar when button is clicked", () => {
  render(<Sidebar />, { wrapper: MemoryRouter });

  const button = screen.getByText("View My Projects");
  fireEvent.click(button);

  expect(screen.getByText("View My Projects")).toBeInTheDocument();

  fireEvent.click(screen.getByText("View My Projects"));

  // Check that the sub-menu appears with the correct options
  expect(screen.getByText("Active Projects")).toBeInTheDocument();
  expect(screen.getByText("Archived Projects")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Active Projects"));

  expect(screen.getByText("Active Projects")).toBeInTheDocument();
});
