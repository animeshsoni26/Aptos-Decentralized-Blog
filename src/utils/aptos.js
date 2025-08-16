import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);
const MODULE_ADDRESS = "0x97e0d12d7e0e95eff08fd352b024c5f997da91cd6e9cbe7986471adaf29b510d";

export const createPost = async (account, title, content) => {
    // Simple hash of content (in production, use IPFS)
    const contentHash = btoa(content).slice(0, 32);

    const transaction = await aptos.transaction.build.simple({
        sender: account.address(),
        data: {
            function: `${MODULE_ADDRESS}::DecentralizedBlog::create_post`,
            functionArguments: [title, Array.from(new TextEncoder().encode(contentHash))]
        },
    });

    return await aptos.signAndSubmitTransaction({
        signer: account,
        transaction,
    });
};

export const getPost = async (authorAddress) => {
    try {
        const resource = await aptos.getAccountResource({
            accountAddress: authorAddress,
            resourceType: `${MODULE_ADDRESS}::DecentralizedBlog::BlogPost`
        });

        return {
            title: resource.title,
            hash: new TextDecoder().decode(new Uint8Array(resource.hash)),
            author: authorAddress
        };
    } catch {
        return null;
    }
};

export { aptos };