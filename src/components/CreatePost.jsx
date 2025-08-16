import React, { useState } from "react";

function CreatePost({ onSubmit, loading }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Title and content are required!");
      return;
    }

    try {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        tags: tagsArray,
      });

      setTitle("");
      setContent("");
      setTags("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-post-container">
      <h2 className="create-post-title">✍️ Create a New Blog Post</h2>
      <input
        type="text"
        placeholder="Enter your post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="create-post-input"
        disabled={loading}
        data-testid="post-title"
      />
      <textarea
        placeholder="Write your post content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="create-post-textarea"
        disabled={loading}
        data-testid="post-content"
      />
      <input
        type="text"
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="create-post-input"
        disabled={loading}
        data-testid="post-tags"
      />
      <button
        type="submit"
        disabled={loading}
        className={`create-post-button ${loading ? "disabled" : ""}`}
        data-testid="submit-button"
      >
        {loading ? "⏳ Creating..." : "🚀 Publish Post"}
      </button>
    </form>
  );
}

export default CreatePost;
