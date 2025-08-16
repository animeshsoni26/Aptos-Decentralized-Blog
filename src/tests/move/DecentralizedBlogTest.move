#[test_only]
module blog_addr::DecentralizedBlogTest {
    use std::signer;
    use std::vector;
    use std::string::{Self, String};
    use aptos_framework::account;
    use aptos_framework::timestamp;
    use blog_addr::DecentralizedBlog;

    // Test helper functions
    fun setup_test_env(): (signer, address) {
        let admin = account::create_account_for_test(@0x1);
        let admin_addr = signer::address_of(&admin);
        
        // Initialize timestamp for testing
        timestamp::set_time_has_started_for_testing(&admin);
        
        (admin, admin_addr)
    }

    fun create_test_user(): (signer, address) {
        let user = account::create_account_for_test(@0x123);
        let user_addr = signer::address_of(&user);
        (user, user_addr)
    }

    fun create_another_test_user(): (signer, address) {
        let user = account::create_account_for_test(@0x456);
        let user_addr = signer::address_of(&user);
        (user, user_addr)
    }

    // Test initialization
    #[test]
    fun test_initialize_blog() {
        let (admin, admin_addr) = setup_test_env();