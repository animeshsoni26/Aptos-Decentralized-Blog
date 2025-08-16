import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import CreatePost from "../../components/CreatePost";

describe("CreatePost Component", () => {
    const mockSubmit = jest.fn();

    beforeEach(() => {
        mockSubmit.mockClear();
    });

    test("renders form elements", () => {
        render(<CreatePost onSubmit={mockSubmit} loading={false} />);

        expect(screen.getByPlaceholderText(/Enter your post title/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Write your post content/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Tags \(comma-separated\)/i)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /🚀 Publish Post/i })
        ).toBeInTheDocument();
    });

    test("disables submit button when loading", () => {
        render(<CreatePost onSubmit={mockSubmit} loading={true} />);
        const button = screen.getByTestId("submit-button"); // Use test id here
        expect(button).toBeDisabled();
        expect(button).toHaveTextContent("⏳ Creating...");
    });

    test("calls onSubmit with correct values", async () => {
        render(<CreatePost onSubmit={mockSubmit} loading={false} />);

        fireEvent.change(screen.getByPlaceholderText(/Enter your post title/i), {
            target: { value: "Test Title" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Write your post content/i), {
            target: { value: "Test Content" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Tags \(comma-separated\)/i), {
            target: { value: "test,blog" },
        });

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /🚀 Publish Post/i }));
        });

        expect(mockSubmit).toHaveBeenCalledWith({
            title: "Test Title",
            content: "Test Content",
            tags: ["test", "blog"],
        });
    });

    test("form prevents empty submission", async () => {
        render(<CreatePost onSubmit={mockSubmit} loading={false} />);

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /🚀 Publish Post/i }));
        });

        expect(mockSubmit).not.toHaveBeenCalled();
    });
});
