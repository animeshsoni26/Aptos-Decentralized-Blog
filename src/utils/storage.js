// Instead of IPFS, use browser storage for simplicity
// In production, replace with actual IPFS integration

const POSTS_KEY = 'blog_posts';

export const savePost = (postId, content) => {
    const posts = JSON.parse(localStorage.getItem(POSTS_KEY) || '{}');
    posts[postId] = {
        content,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    return postId;
};

export const getPostContent = (postId) => {
    const posts = JSON.parse(localStorage.getItem(POSTS_KEY) || '{}');
    return posts[postId]?.content || 'Content not found';
};

export const getAllStoredPosts = () => {
    return JSON.parse(localStorage.getItem(POSTS_KEY) || '{}');
};