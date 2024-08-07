import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { EntryList, EntryListProps } from "../../todo-list/components/entry-list";



describe("EntryList", () => {
  const mockOnDescriptionUpdated = jest.fn();
  const mockOnCheckItemChanged = jest.fn();
  const mockOnDeleteItem = jest.fn();

  const defaultProps: EntryListProps = {
    items: [
      { id: "1", description: "Test Todo 1", isCompleted: false },
      { id: "2", description: "Test Todo 2", isCompleted: true },
    ],
    onDescriptionUpdated: mockOnDescriptionUpdated,
    onCheckItemChanged: mockOnCheckItemChanged,
    onDeleteItem: mockOnDeleteItem,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the correct number of items", () => {
    render(<EntryList {...defaultProps} />);
    expect(screen.getByText("Showing 2 Item(s)")).toBeInTheDocument();
  });

  it("renders each todo item", () => {
    render(<EntryList {...defaultProps} />);
    expect(screen.getByDisplayValue("Test Todo 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Todo 2")).toBeInTheDocument();
  });

  it("calls onCheckItemChanged when checkbox is clicked", async () => {
    const user = userEvent.setup();
    render(<EntryList {...defaultProps} />);
    const checkbox = screen.getAllByRole("checkbox")[0];
    await user.click(checkbox);
    expect(mockOnCheckItemChanged).toHaveBeenCalledWith(defaultProps.items[0], true);
  });

  it("calls onCheckItem changed when already marked checkbox is clicked", async () => {
    const user = userEvent.setup();
    render(<EntryList {...defaultProps} />);
    const checkbox = screen.getAllByRole("checkbox")[1];
    await user.click(checkbox);
    expect(mockOnCheckItemChanged).toHaveBeenCalledWith(defaultProps.items[1], false);
  });

  it("calls onDeleteItem when delete button is clicked", async () => {
    const user = userEvent.setup();
    render(<EntryList {...defaultProps} />);
    const deleteButtons = screen.getAllByText("x");
    await user.click(deleteButtons[0]);
    expect(mockOnDeleteItem).toHaveBeenCalledWith("1");
  });

  it("updates description and calls onDescriptionUpdated after debounce", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<EntryList {...defaultProps} />);
    const input = screen.getByDisplayValue("Test Todo 1");
    await user.type(input, " and more");
    
    jest.advanceTimersByTime(1500);
    
    await waitFor(() => {
      expect(mockOnDescriptionUpdated).toHaveBeenCalledWith(
        defaultProps.items[0],
        "Test Todo 1 and more"
      );
    });
    
    jest.useRealTimers();
  });

  it("makes the background color of the input dirty before debounce", async () => {
    const user = userEvent.setup();
    render(<EntryList {...defaultProps} />);
    const input = screen.getByDisplayValue("Test Todo 1");
    await user.type(input, " and more");
    expect(input).toHaveClass("bg-light");
  });

  it('does not allow updating completed items', async () => {
    const user = userEvent.setup();
    render(<EntryList {...defaultProps} />);
    const input = screen.getByDisplayValue("Test Todo 2");
    await user.type(input, " and more");
    expect(input).toHaveValue("Test Todo 2");
  });
});
