# Decentralized Blog UI

This project is a decentralized blogging platform built on the Aptos blockchain. It allows users to create and view blog posts securely and transparently.

## Features

- Create new blog posts with a title and content hash.
- View a list of all blog posts.
- Interact with the Aptos blockchain for storing and retrieving posts.

## Technologies Used

- React: A JavaScript library for building user interfaces.
- TypeScript: A typed superset of JavaScript that compiles to plain JavaScript.
- Aptos: A blockchain platform for decentralized applications.

## Project Structure

```
decentralized-blog-ui
├── public
│   └── index.html          # Main HTML file
├── src
│   ├── components          # React components
│   │   ├── BlogPost.tsx    # Component to display a single blog post
│   │   ├── CreatePostForm.tsx # Form for creating a new blog post
│   │   └── PostList.tsx     # Component to display a list of blog posts
│   ├── pages               # Application pages
│   │   └── Home.tsx        # Main page of the application
│   ├── services            # Services for interacting with Aptos
│   │   └── aptosClient.ts  # Functions to interact with the Aptos blockchain
│   ├── App.tsx             # Main application component
│   ├── index.tsx           # Entry point for the React application
│   └── types               # TypeScript types and interfaces
│       └── index.ts
├── package.json            # npm configuration file
├── tsconfig.json           # TypeScript configuration file
└── README.md               # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd decentralized-blog-ui
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

- Use the form on the home page to create a new blog post by entering a title and content hash.
- View the list of blog posts displayed below the form.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.