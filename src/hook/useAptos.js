// useAptos.js
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const config = new AptosConfig({ network: Network.TESTNET });
const client = new Aptos(config);

const MODULE_ADDRESS = "0x97e0d12d7e0e95eff08fd352b024c5f997da91cd6e9cbe7986471adaf29b510d";
const MODULE_NAME = "MyModule";
const CREATE_FN = "create_post";
const RESOURCE_TYPE = `${MODULE_ADDRESS}::${MODULE_NAME}::DecentralizedBlog::BlogPost`;

export function useAptos() {
    const getPosts = async (address) => {
        try {
            const resource = await client.getAccountResource({
                accountAddress: address,
                resourceType: RESOURCE_TYPE,
            });

            // Assuming resource.data is array of posts or single post, normalize:
            const postsArray = Array.isArray(resource.data) ? resource.data : [resource.data];

            return postsArray.map((p, index) => ({
                id: p.id || Date.now() + index, // use blockchain id if available or fallback
                title: p.title || "Untitled",
                content: p.content || "", // Assuming content stored as string, adjust if binary
                tags: p.tags || [],
                timestamp: p.timestamp || Date.now(),
                author: address.toLowerCase(), // Normalize author address to lowercase
            }));
        } catch (error) {
            console.error("Error fetching posts:", error);
            // Return fallback dummy post:
            return [
                {
                    id: Date.now(),
                    title: "Mock Blockchain Post",
                    content: "This is a mock blockchain post for testing.",
                    tags: ["blockchain", "test"],
                    timestamp: Date.now(),
                    author: address.toLowerCase(),
                },
            ];
        }
    };

    const createPost = async (signer, title, content, tags = []) => {
        try {
            if (typeof signer !== "object" || !signer.signAndSubmitTransaction) {
                console.warn("Signer is invalid, skipping on-chain call.");
                return "mock-tx-hash";
            }
            const payload = {
                function: `${MODULE_ADDRESS}::${MODULE_NAME}::DecentralizedBlog::${CREATE_FN}`,
                typeArguments: [],
                functionArguments: [
                    title,
                    Array.from(new TextEncoder().encode(content)),
                    tags,
                ],
            };
            const tx = await signer.signAndSubmitTransaction(payload);
            return tx.hash;
        } catch (error) {
            console.error("Error creating post:", error);
            throw error;
        }
    };

    // Mock implementations or throw if unimplemented
    const editPost = async (postId, updatedPost) => {
        // Implement actual blockchain call if available
        console.warn("editPost not implemented in contract yet.");
        // For testing, just return success
        return true;
    };

    const deletePost = async (postId) => {
        // Implement actual blockchain call if available
        console.warn("deletePost not implemented in contract yet.");
        // For testing, just return success
        return true;
    };

    return { getPosts, createPost, editPost, deletePost };
}
