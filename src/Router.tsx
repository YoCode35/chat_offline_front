import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
// import WebSocketChat from "./components/WebSocketChat";
import { chatLoader } from "./loaders/chatLoader";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "/chat", element: <Chat />, loader: chatLoader },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
