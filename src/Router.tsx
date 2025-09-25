import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import WebSocketChat from "./components/WebSocketChat";
import Login from "./pages/Login";
import Register from "./pages/Register";

import "./css/App.css";

const router = createBrowserRouter([
  {
    element: <Layout />, 
    children: [
      { path: "/", element: <Home /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/chat", element: <WebSocketChat /> },
    ],
  },
]);

export default router;