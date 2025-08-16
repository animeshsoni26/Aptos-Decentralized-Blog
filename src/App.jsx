import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import CreatePost from "./components/CreatePost";
import PostCard from "./components/PostCard";
import { useWallet } from "./hook/useWallet";
import { useAptos } from "./hook/useAptos";
import "./App.css";

// Use large unique IDs for dummy posts to avoid collision
const DUMMY_POSTS = [
    {
        id: 1000001,
        title: "Welcome to Decentralized Blog",
        content:
            "This is a sample post so your blog isn't empty. Connect your wallet to create real blockchain posts.",
        tags: ["sample", "demo"],
        timestamp: Date.now(),
        author: "0x1a2b3c4d5e6f7g8h9i".toLowerCase(),
        username: "Alice Johnson",
        avatar: "https://i.pravatar.cc/150?img=32",
    },
    {
        id: 1000002,
        title: "Getting Started",
        content: "Learn how to post on the Aptos blockchain with this dApp.",
        tags: ["tutorial", "aptos"],
        timestamp: Date.now() - 3600000,
        author: "0x9f8e7d6c5b4a3210".toLowerCase(),
        username: "Bob Smith",
        avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
        id: 1000003,
        title: "Why Blockchain?",
        content: "Blockchain ensures transparency, immutability, and decentralization.",
        tags: ["blockchain", "technology"],
        timestamp: Date.now() - 7200000,
        author: "0xabc123def456ghi789".toLowerCase(),
        username: "Carol White",
        avatar: "https://i.pravatar.cc/150?img=48",
    },
];

function App() {
    const [posts, setPosts] = useState(DUMMY_POSTS);
    const [loading, setLoading] = useState(false);
    const { connected, account, connect } = useWallet();
    const { getPosts, createPost, editPost, deletePost } = useAptos();

    // Helper to generate unique IDs for posts that don't have one
    const generateUniqueId = () => Date.now() + Math.floor(Math.random() * 1000);

    // Load blockchain posts when wallet connects
    useEffect(() => {
        async function loadPosts() {
            if (connected && account?.address) {
                setLoading(true);
                try {
                    const blockchainPosts = await getPosts(account.address);

                    // Normalize IDs and lowercase author address
                    const sanitizedPosts = blockchainPosts.map((post, index) => ({
                        ...post,
                        id: post.id ? post.id : generateUniqueId(),
                        author: post.author.toLowerCase(),
                    }));

                    // Merge blockchain posts with dummy posts but avoid duplicate IDs
                    // Blockchain posts get priority to appear first
                    setPosts((prev) => {
                        const existingIds = new Set(prev.map((p) => p.id));
                        const filteredBlockchainPosts = sanitizedPosts.filter(
                            (p) => !existingIds.has(p.id)
                        );
                        return [...filteredBlockchainPosts, ...prev];
                    });
                } catch (error) {
                    console.error("Error loading blockchain posts:", error);
                } finally {
                    setLoading(false);
                }
            }
        }
        loadPosts();
    }, [connected, account, getPosts]);

    // Create a new post handler
    const handleCreatePost = async (newPost) => {
        if (!connected || !account) {
            alert("Please connect your wallet before posting.");
            return;
        }
        try {
            setLoading(true);
            await createPost(account, newPost.title, newPost.content, newPost.tags);

            const updatedPosts = await getPosts(account.address);

            const sanitizedPosts = updatedPosts.map((post) => ({
                ...post,
                id: post.id ? post.id : generateUniqueId(),
                author: post.author.toLowerCase(),
            }));

            setPosts((prev) => {
                const existingIds = new Set(prev.map((p) => p.id));
                const newOnly = sanitizedPosts.filter((p) => !existingIds.has(p.id));
                return [...newOnly, ...prev];
            });
        } catch (error) {
            console.error("Error creating post:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditPost = async (postId, updatedPost) => {
        if (!connected) {
            alert("Please connect your wallet to edit.");
            return;
        }
        setLoading(true);
        try {
            await editPost(postId, updatedPost);
            setPosts((prev) =>
                prev.map((post) => (post.id === postId ? { ...post, ...updatedPost } : post))
            );
        } catch (error) {
            console.error("Error editing post:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!connected) {
            alert("Please connect your wallet to delete.");
            return;
        }
        setLoading(true);
        try {
            await deletePost(postId);
            setPosts((prev) => prev.filter((post) => post.id !== postId));
        } catch (error) {
            console.error("Error deleting post:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app">
            <Header connected={connected} account={account} onConnect={connect} />
            <main className="main">
                <CreatePost onSubmit={handleCreatePost} loading={loading} />

                <div className="posts">
                    {loading ? (
                        <div className="loading">Loading posts...</div>
                    ) : (
                        posts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onEdit={handleEditPost}
                                onDelete={handleDeletePost}
                                isOwner={connected && post.author === account?.address.toLowerCase()}
                            />
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;
