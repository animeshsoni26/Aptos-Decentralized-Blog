# Aptos Decentralized Blog

A decentralized blog platform where users can create and manage posts on the Aptos blockchain, featuring a clean React frontend and a Move-based smart contract backend. This project leverages web3 and Aptos's Move language to provide a censorship-resistant, user-owned blogging experience.

---

## Table of Contents

- [Demo & Screenshots](#demo--screenshots)  
- [Features](#features)  
- [Architecture & Tech Stack](#architecture--tech-stack)  
- [Project Structure](#project-structure)  
- [Setup & Local Development](#setup--local-development)  
  - [Prerequisites](#prerequisites)  
  - [Backend (Move) Setup](#backend-move-setup)  
  - [Frontend Setup](#frontend-setup)  
- [Testing](#testing)  
- [Deployment](#deployment)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Demo & Screenshots

https://aptos-decentralized-blog.vercel.app/
<img width="1918" height="962" alt="image" src="https://github.com/user-attachments/assets/80198afd-bfb4-4e9f-bd42-61023de46f2c" />

---

## Features

- Smart contract-based blog post creation and storage using Aptos & Move  
- Connect wallet functionality — decentralized identity and interaction  
- Clean, responsive React UI for creating and viewing posts  
- Full-stack architecture combining Move on-chain logic with frontend interactions

---

## Architecture & Tech Stack

- **Backend:** Aptos Move smart contract (`.move` files under `sources/`)  
- **Config:** `Move.toml` for package and named address setup  
- **Frontend:** React.js with modern styling (`App.jsx`, CSS files, `components/`, etc.)  
- **Tools & Utilities:**
  - `aptos` CLI for compiling & deploying contracts  
  - `npm` / `yarn` for frontend dev and build scripts  
  - Vercel for deployment (optional)  
- **Version Control:** Git and GitHub (repo: `Aptos-Decentralized-Blog`)

---

## Project Structure

```plaintext
aptos/
├── sources/
│   └── blog.move           # Move module containing smart contract logic
├── Move.toml               # Aptos package config, addresses, dependencies
├── public/                 # Static assets and public HTML
│   └── index.html
├── src/                    # React frontend source
│   ├── components/
│   ├── App.jsx
│   ├── index.js
│   └── styles/             # CSS files
├── package.json            # Frontend dependencies
├── package-lock.json
├── .env                    # Environment variables (keep secret, don't push)
├── .env.example            # Example env variables (safe to push)
├── README.md
└── .gitignore
```
---
## Setup & Local Development

### Prerequisites

- Node.js & npm installed  
- Aptos CLI configured (linked to devnet)  
- An Aptos account funded with testnet tokens  

### Backend (Move) Setup

1. Navigate to the root of the project and compile the Move module:  
   ```bash
   aptos move compile --named-addresses module=default
   
2. Deploy (publish) the contract to Aptos Devnet:
   ```bash
   aptos move publish --named-addresses module=default --assume-yes
Take note of the published contract address for frontend integration.
   
### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
2. Create a .env file from .env.example and fill in variables if needed.
3. Launch the React app:
   ```bash
   npm start
4. The app will open in your browser at http://localhost:3000.
---
## Testing

### Smart Contract (Move)

Run Move unit tests (if implemented):
   ```bash
   aptos move test
   ```
### Frontend

If frontend tests are set up, run them with:
   ```bash
   npm test
   ```
---
## Deployment

- Deploy the frontend using Vercel by connecting your Aptos-Decentralized-Blog repository and clicking "Deploy".

- Ensure your build command is set to npm run build and the output directory is set to build/.

- For the backend, publish the Move contract as described in Setup steps.
---
## Contributing
1. Contributions are welcome! To propose features, improvements, or issues:

2. Fork the repository

3. Create a feature branch:
   ```bash
   git checkout -b feature/YourFeature
   ```
4. Make changes and run tests

5. Commit and push your branch

6. Open a Pull Request for review
---

## Acknowledgements

- Built on the **Aptos blockchain** using **Move**, praised for its high scalability and parallel transaction execution  
- Inspired by decentralized blog architectures in Move ecosystems  
---

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.




