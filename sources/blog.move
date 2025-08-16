module MyModule::DecentralizedBlog {
    use std::string;

    struct BlogPost has key, store {
        title: string::String,
        hash: vector<u8>,
    }

    public fun create_post(author: &signer, title: string::String, hash: vector<u8>) {
        let post = BlogPost { title, hash };
        move_to(author, post);
    }

    public fun get_post(author_addr: address): (string::String, vector<u8>) acquires BlogPost {
        let post = borrow_global<BlogPost>(author_addr);
        (post.title, post.hash)
    }
}
