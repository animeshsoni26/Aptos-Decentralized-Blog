import { AptosClient } from "aptos";

const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
export const client = new AptosClient(NODE_URL);

const MODULE_ADDRESS = "0x97e0d12d7e0e95eff08fd352b024c5f997da91cd6e9cbe7986471adaf29b510d";
const MODULE_NAME = "MyModule";
const FUNCTION_NAME = "create_post";

export async function createPost(account, title, content) {
    const payload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::${MODULE_NAME}::DecentralizedBlog::${FUNCTION_NAME}`,
        type_arguments: [],
        arguments: [title, Array.from(new TextEncoder().encode(content))],
    };

    const txnRequest = await client.generateTransaction(account.address, payload);
    const signedTxn = await client.signTransaction(account, txnRequest);
    const res = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(res.hash);
    return res.hash;
}

export async function getPosts(authorAddr) {
    try {
        const resource = await client.getAccountResource(
            authorAddr,
            `${MODULE_ADDRESS}::${MODULE_NAME}::DecentralizedBlog::BlogPost`
        );

        // Return an array for compatibility with posts.map()
        return [{
            id: Date.now(), // unique id for React key
            title: resource.data.title,
            content: new TextDecoder().decode(new Uint8Array(resource.data.hash || [])),
            tags: resource.data.tags || [],
            timestamp: Date.now(),
            author: authorAddr,
        }];
    } catch (error) {
        console.error("No post found:", error);
        return []; // always return array
    }
}
