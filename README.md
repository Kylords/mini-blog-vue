# Mini Blog Frontend

## Project Overview
This frontend application complements the Mini Blog API backend, providing a modern and interactive interface for users to create, view, and interact with posts. It demonstrates real-time updates through GraphQL subscriptions and showcases my skills in Vue.js, TypeScript, and integrating with a GraphQL API.

## Tech Stack
- Vue 3 (Composition API)
- TypeScript
- Apollo Client (GraphQL)
- WebSockets (Action Cable for subscriptions)
- Vite (build tool)

## Installation & Setup
1. Clone the repository: git clone <frontend-repo-link>
2. Navigate to the project directory: cd mini-blog-frontend
3. Install dependencies: npm install or yarn install
4. Create a `.env` file in the project root (if it doesn’t exist) and set environment variables:
   - VITE_GRAPHQL_HTTP=http://localhost:3000/graphql
   - VITE_GRAPHQL_WS=ws://localhost:3000/cable
5. Start the development server: npm run dev or yarn dev
6. Open the app in your browser at http://localhost:5173 (or the port shown in the terminal)

**Note:** The frontend expects the backend API to be running at `http://localhost:3000` unless the environment variables are updated.

## Features
- View all posts and see them update in real-time
- Create new posts with a form
- Edit and delete posts you created
- Real-time subscription **demo**: when a user creates a post, all logged-in users see it instantly at the top of their post list
- Form validation and error handling for inputs
- Responsive and interactive UI components

## Authentication
- Users authenticate via JWT obtained from the backend login endpoint
- JWT is stored in local storage and attached to all GraphQL requests

## Security & Best Practices
- JWT stored securely in local storage (avoid storing sensitive info)
- Proper error handling for API responses
- Modular Vue components for maintainability

## Git & Branching Strategy
- Git is used for version control
- develop branch is used for active development
- main branch contains stable production-ready code
- Make meaningful commits with descriptive messages for every feature or fix
