import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { CreateEntry, CreateEntryProps } from "../../todo-list/components/create-entry";

// mock the queryClient
jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQueryClient: jest.fn(),
}));

describe("CreateEntry", () => {
  const mockOnCreate = jest.fn();

  const defaultProps: CreateEntryProps = {
    onCreate: mockOnCreate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the input field and add button", () => {
    render(<CreateEntry {...defaultProps} />);
    expect(screen.getByPlaceholderText("Add a new todo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("calls onCreate when Add button is clicked", async () => {
    const user = userEvent.setup();
    render(<CreateEntry {...defaultProps} />);
    
    const input = screen.getByPlaceholderText("Add a new todo");
    const addButton = screen.getByRole("button", { name: "Add" });

    await user.type(input, "New todo item");
    await user.click(addButton);

    expect(mockOnCreate).toHaveBeenCalledWith({ description: "New todo item", isCompleted: false });
    expect(input).toHaveValue("");
  });

  it("calls onCreate when Enter key is pressed", async () => {
    const user = userEvent.setup();
    render(<CreateEntry {...defaultProps} />);
    
    const input = screen.getByPlaceholderText("Add a new todo");

    await user.type(input, "New todo item{enter}");

    expect(mockOnCreate).toHaveBeenCalledWith({ description: "New todo item", isCompleted: false });
    expect(input).toHaveValue("");
  });

  it("does not call onCreate when input is empty", async () => {
    const user = userEvent.setup();
    render(<CreateEntry {...defaultProps} />);
    
    const addButton = screen.getByRole("button", { name: "Add" });

    await user.click(addButton);

    expect(mockOnCreate).not.toHaveBeenCalled();
  });
});
