import React from "react";
import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../../App";

// Mock hooks
jest.mock("../../hook/useWallet", () => ({
    useWallet: jest.fn(),
}));

jest.mock("../../hook/useAptos", () => ({
    useAptos: jest.fn(),
}));

// Mock components
jest.mock("../../components/Header", () => {
    return function MockHeader({ connected, account, onConnect }) {
        return (
            <div data-testid="header">
                <button onClick={onConnect} data-testid="connect-btn">
                    {connected ? `Connected: ${account?.address}` : "Connect Wallet"}
                </button>
            </div>
        );
    };
});

// === FIXED CreatePost mock ===
jest.mock("../../components/CreatePost", () => {
    return function MockCreatePost({ onSubmit, loading }) {
        return (
            <div data-testid="create-post">
                <button
                    onClick={() =>
                        onSubmit({ title: "Test Post", content: "Test Content", tags: [] }) // single object argument
                    }
                    disabled={loading}
                    data-testid="create-post-btn"
                >
                    {loading ? "Creating..." : "Create Post"}
                </button>
            </div>
        );
    };
});

jest.mock("../../components/PostCard", () => {
    return function MockPostCard({ post, onEdit, onDelete, isOwner }) {
        return (
            <div data-testid={`post-${post.id}`}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <span>Author: {post.author}</span>
                {isOwner && (
                    <div>
                        <button
                            onClick={() =>
                                onEdit(post.id, { title: "Updated", content: "Updated" })
                            }
                            data-testid={`edit-${post.id}`}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(post.id)}
                            data-testid={`delete-${post.id}`}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        );
    };
});

describe("App Component", () => {
    const mockUseWallet = require("../../hook/useWallet").useWallet;
    const mockUseAptos = require("../../hook/useAptos").useAptos;

    const mockConnect = jest.fn();
    const mockGetPosts = jest.fn();
    const mockCreatePost = jest.fn();
    const mockEditPost = jest.fn();
    const mockDeletePost = jest.fn();

    const mockAccount = { address: "0x123456789abcdef" };

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseWallet.mockReturnValue({
            connected: false,
            account: null,
            connect: mockConnect,
        });
        mockUseAptos.mockReturnValue({
            getPosts: mockGetPosts,
            createPost: mockCreatePost,
            editPost: mockEditPost,
            deletePost: mockDeletePost,
        });
        mockGetPosts.mockResolvedValue([]);
    });

    describe("Wallet Connection", () => {
        test("renders with wallet disconnected state", async () => {
            await act(async () => {
                render(<App />);
            });

            expect(screen.getByTestId("header")).toBeInTheDocument();
            expect(screen.getByTestId("create-post")).toBeInTheDocument();
            expect(screen.getByText("Connect Wallet")).toBeInTheDocument();
        });

        test("shows connected state when wallet is connected", async () => {
            mockUseWallet.mockReturnValue({
                connected: true,
                account: mockAccount,
                connect: mockConnect,
            });

            await act(async () => {
                render(<App />);
            });

            expect(
                screen.getByText(`Connected: ${mockAccount.address}`)
            ).toBeInTheDocument();
        });

        test("loads posts when wallet connects", async () => {
            mockUseWallet.mockReturnValue({
                connected: true,
                account: mockAccount,
                connect: mockConnect,
            });

            const mockPosts = [
                {
                    id: "1",
                    title: "Test Post",
                    content: "Test Content",
                    author: mockAccount.address,
                },
            ];
            mockGetPosts.mockResolvedValue(mockPosts);

            await act(async () => {
                render(<App />);
            });

            await waitFor(() => {
                expect(mockGetPosts).toHaveBeenCalledWith(mockAccount.address);
            });

            expect(screen.getByTestId("post-1")).toBeInTheDocument();
        });
    });

    describe("Post Management", () => {
        beforeEach(() => {
            mockUseWallet.mockReturnValue({
                connected: true,
                account: mockAccount,
                connect: mockConnect,
            });
        });

        test("creates a new post successfully", async () => {
            mockCreatePost.mockResolvedValue();

            mockGetPosts
                .mockResolvedValueOnce([]) // initial load no posts
                .mockResolvedValueOnce([
                    {
                        id: "1",
                        title: "Test Post",
                        content: "Test Content",
                        author: mockAccount.address,
                    },
                ]); // after create

            await act(async () => {
                render(<App />);
            });

            const createButton = screen.getByTestId("create-post-btn");

            await act(async () => {
                fireEvent.click(createButton);
            });

            await waitFor(() => {
                expect(mockCreatePost).toHaveBeenCalledWith(
                    mockAccount,
                    "Test Post",
                    "Test Content",
                    []
                );
            });

            await waitFor(() => {
                expect(mockGetPosts).toHaveBeenCalledTimes(2);
            });

            expect(screen.getByTestId("post-1")).toBeInTheDocument();
        });

        test("prevents post creation when wallet not connected", async () => {
            mockUseWallet.mockReturnValue({
                connected: false,
                account: null,
                connect: mockConnect,
            });

            window.alert = jest.fn();

            await act(async () => {
                render(<App />);
            });

            const createButton = screen.getByTestId("create-post-btn");

            await act(async () => {
                fireEvent.click(createButton);
            });

            expect(window.alert).toHaveBeenCalledWith(
                "Please connect your wallet before posting."
            );
            expect(mockCreatePost).not.toHaveBeenCalled();
        });

        test("edits a post successfully", async () => {
            const mockPost = {
                id: "1",
                title: "Original",
                content: "Original Content",
                author: mockAccount.address,
            };

            mockGetPosts.mockResolvedValue([mockPost]);
            mockEditPost.mockResolvedValue();

            await act(async () => {
                render(<App />);
            });

            await waitFor(() => {
                expect(screen.getByTestId("edit-1")).toBeInTheDocument();
            });

            await act(async () => {
                fireEvent.click(screen.getByTestId("edit-1"));
            });

            await waitFor(() => {
                expect(mockEditPost).toHaveBeenCalledWith("1", {
                    title: "Updated",
                    content: "Updated",
                });
            });
        });

        test("deletes a post successfully", async () => {
            const mockPost = {
                id: "1",
                title: "Test Post",
                content: "Test Content",
                author: mockAccount.address,
            };

            mockGetPosts
                .mockResolvedValueOnce([mockPost]) // before deletion
                .mockResolvedValueOnce([]); // after deletion

            mockDeletePost.mockResolvedValue();

            await act(async () => {
                render(<App />);
            });

            await waitFor(() => {
                expect(screen.getByTestId("delete-1")).toBeInTheDocument();
            });

            await act(async () => {
                fireEvent.click(screen.getByTestId("delete-1"));
            });

            await waitFor(() => {
                expect(mockDeletePost).toHaveBeenCalledWith("1");
            });

            await waitFor(() => {
                expect(screen.queryByTestId("post-1")).not.toBeInTheDocument();
            });
        });

        test("shows loading state during operations", async () => {
            mockCreatePost.mockImplementation(
                () => new Promise((resolve) => setTimeout(resolve, 100))
            );

            await act(async () => {
                render(<App />);
            });

            const createButton = screen.getByTestId("create-post-btn");

            await act(async () => {
                fireEvent.click(createButton);
            });

            expect(screen.getByText("Creating...")).toBeInTheDocument();

            await waitFor(() => {
                expect(screen.queryByText("Creating...")).not.toBeInTheDocument();
            });
        });
    });

    describe("Error Handling", () => {
        beforeEach(() => {
            mockUseWallet.mockReturnValue({
                connected: true,
                account: mockAccount,
                connect: mockConnect,
            });
            jest.spyOn(console, "error").mockImplementation(() => { });
        });

        afterEach(() => {
            console.error.mockRestore();
        });

        test("handles post loading errors gracefully", async () => {
            mockGetPosts.mockRejectedValue(new Error("Network error"));

            await act(async () => {
                render(<App />);
            });

            await waitFor(() => {
                expect(console.error).toHaveBeenCalledWith(
                    "Error loading blockchain posts:",
                    expect.any(Error)
                );
            });

            expect(screen.getByTestId("create-post")).toBeInTheDocument();
        });

        test("handles post creation errors gracefully", async () => {
            mockCreatePost.mockRejectedValue(new Error("Transaction failed"));

            await act(async () => {
                render(<App />);
            });

            const createButton = screen.getByTestId("create-post-btn");

            await act(async () => {
                fireEvent.click(createButton);
            });

            await waitFor(() => {
                expect(console.error).toHaveBeenCalledWith(
                    "Error creating post:",
                    expect.any(Error)
                );
            });
        });
    });

    describe("Post Ownership", () => {
        const otherAccount = { address: "0x999999" };

        test("shows edit/delete buttons only for own posts", async () => {
            const ownPost = {
                id: "1",
                title: "Own Post",
                content: "Content",
                author: mockAccount.address,
            };

            const otherPost = {
                id: "2",
                title: "Other Post",
                content: "Content",
                author: otherAccount.address,
            };

            mockUseWallet.mockReturnValue({
                connected: true,
                account: mockAccount,
                connect: mockConnect,
            });

            mockGetPosts.mockResolvedValue([ownPost, otherPost]);

            await act(async () => {
                render(<App />);
            });

            // Own post edit/delete buttons exist
            expect(screen.getByTestId("edit-1")).toBeInTheDocument();
            expect(screen.getByTestId("delete-1")).toBeInTheDocument();

            // Other post edit/delete buttons do NOT exist
            expect(screen.queryByTestId("edit-2")).not.toBeInTheDocument();
            expect(screen.queryByTestId("delete-2")).not.toBeInTheDocument();
        });
    });
});
