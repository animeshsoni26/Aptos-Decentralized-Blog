import React, { useState } from "react";
import { formatDate } from "../utils/helpers";

function PostCard({ post, onEdit, onDelete, isOwner }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(post.title);
    const [editContent, setEditContent] = useState(post.content);
    const [editTags, setEditTags] = useState(post.tags ? post.tags.join(", ") : "");

    const handleSave = async () => {
        try {
            const tagsArray = editTags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag);
            await onEdit(post.id, editTitle, editContent, tagsArray);
            setIsEditing(false);
        } catch (err) {
            console.error("Edit failed:", err);
        }
    };

    const handleDelete = async () => {
        try {
            if (window.confirm("Are you sure you want to delete this post?")) {
                await onDelete(post.id);
            }
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    if (isEditing) {
        const inputStyle = {
            width: "100%",
            padding: "8px",
            fontSize: "16px",
            marginBottom: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
        };

        const textareaStyle = {
            ...inputStyle,
            height: "100px",
            resize: "vertical",
        };

        return (
            <div className="post-card" data-testid={`post-edit-${post.id}`}>
                <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={inputStyle}
                />
                <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    style={textareaStyle}
                />
                <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="Tags (comma-separated)"
                    style={inputStyle}
                />
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button onClick={handleSave} className="btn btn-primary">
                        Save
                    </button>
                    <button onClick={() => setIsEditing(false)} className="btn btn-secondary">
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="post-card" data-testid={`post-${post.id}`}>
            <div className="post-header">
                <img
                    src={post.avatar || `https://i.pravatar.cc/150?u=${post.author}`}
                    alt={post.username || "Anonymous"}
                    className="avatar"
                />
                <div>
                    <h3 className="username">{post.username || "Anonymous User"}</h3>
                    <p className="wallet">{post.author}</p>
                </div>
                <span className="post-date">{formatDate(post.timestamp)}</span>
            </div>

            <h2 className="post-title">{post.title}</h2>
            <p className="post-content">{post.content}</p>

            {post.tags && post.tags.length > 0 && (
                <div className="tags">
                    {post.tags.map((tag) => (
                        <span key={`${post.id}-${tag}`} className="tag">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {isOwner && (
                <div className="button-group">
                    <button
                        data-testid={`edit-${post.id}`}
                        onClick={() => setIsEditing(true)}
                        className="btn btn-warning"
                    >
                        Edit
                    </button>
                    <button
                        data-testid={`delete-${post.id}`}
                        onClick={handleDelete}
                        className="btn btn-danger"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

export default PostCard;
