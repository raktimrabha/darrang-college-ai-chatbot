# Darrang College AI Chatbot - Developer Guide

Welcome to the Developer Guide for the **Darrang College AI Admission Assistant**. This document covers everything you need to know about the project's architecture, tools, components, and how you can improve it further.

---

## 🏗️ Project Architecture & Tech Stack

This project is a modern, fast, and accessible web application designed to help students get instant answers about the college.

### Core Technologies
- **Frontend Framework**: React 19 + Vite 7 (extremely fast development and build times).
- **Routing**: `@tanstack/react-router` for type-safe routing. The app uses file-based routing inside `src/routes/`.
- **Styling**: Tailwind CSS v4 for utility-first styling.
- **UI Components**: `shadcn/ui` based on Radix UI primitives. It provides beautifully designed, accessible components out of the box (found in `src/components/ui`).
- **Icons**: `lucide-react` for scalable SVG icons.

---

## 📂 Project Structure

Here's a breakdown of the important folders and files:

```text
├── src/
│   ├── components/
│   │   ├── chat/         # All chat-related components (ChatPage, ChatWindow, MessageBubble, etc.)
│   │   ├── theme/        # Light/Dark mode theming logic
│   │   └── ui/           # Generic reusable UI components (shadcn/ui)
│   ├── hooks/
│   │   ├── useChat.ts    # Core state management for the chat functionality
│   │   └── use-mobile.tsx# Helper hook to detect mobile screen sizes
│   ├── routes/           # TanStack Router files
│   │   ├── __root.tsx    # Root layout, theme provider, meta tags
│   │   └── index.tsx     # The main '/' route that renders ChatPage
│   ├── utils/
│   │   └── api.ts        # Handles fetching data from the backend API
│   ├── router.tsx        # Router configuration
│   └── styles.css        # Global CSS and Tailwind directives
```

---

## ⚙️ How the App Works (Data Flow)

1. **Routing**: When a user visits the app, `__root.tsx` loads the `ThemeProvider` and the `Outlet`. The `/` route (`index.tsx`) renders the `ChatPage` component.
2. **State Management**: `ChatPage` uses the custom hook `useChat` (`src/hooks/useChat.ts`). This hook uses a React `useReducer` to manage the chat state (messages, loading status, errors, etc.).
3. **User Interaction**:
   - The user types a message in `InputBar.tsx` and hits send.
   - `useChat` adds the user's message to the local state and sets `isLoading` to true.
   - It then extracts the last 6 messages as context and calls `sendChatMessage` from `src/utils/api.ts`.
4. **API Call**: `sendChatMessage` sends a `POST` request to `/api/chat` (prepended by `VITE_API_BASE_URL` if set).
5. **Response**: Once the backend responds, the bot's message is added to the state, and `isLoading` is set to false. `ChatWindow.tsx` and `MessageBubble.tsx` dynamically render the updated list of messages.

---

## 🛠️ How to Work on This Project

### 1. Starting the Development Server
Run the following command to start the local Vite server:
```bash
npm run dev
```

### 2. Adding or Modifying UI Components
If you want to add a new generic UI component, you can use the pre-configured `shadcn/ui` components located in `src/components/ui`.
If you want to modify how the chat looks:
- Edit `MessageBubble.tsx` to change message styling.
- Edit `InputBar.tsx` to change the text input field.

### 3. Backend & API Configuration
Currently, the frontend sends a `POST` request to `/api/chat`. 
- **Local Dev**: If your backend runs on a different port (e.g., localhost:3000), you must create a `.env` file in the root directory:
  ```env
  VITE_API_BASE_URL=http://localhost:3000
  ```
- **Production**: Ensure your production environment variables point to your live backend endpoint.

---

## 🚀 Ideas for Improvement

Here are some features you can implement next to make the chatbot even better:

1. **Markdown Rendering**: Currently, the bot outputs text. You can add `react-markdown` to parse bold text, lists, and links properly in `MessageBubble.tsx`.
2. **Streaming Responses**: Instead of waiting for the full response, implement Server-Sent Events (SSE) or HTTP Streaming in `api.ts` and `useChat.ts` to make the bot type out the answer word by word.
3. **Chat History Persistence**: Use `localStorage` inside `useChat.ts` to save chat history so the user doesn't lose their conversation if they refresh the page.
4. **Pre-defined Suggestions**: Add more interactive quick-reply chips in `SuggestionChips.tsx` based on the most frequently asked questions at Darrang College.

## 📚 Useful Resources
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [TanStack Router Documentation](https://tanstack.com/router/latest)
- [React 19 Documentation](https://react.dev/)
