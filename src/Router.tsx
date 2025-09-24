        // <Routes>
        //   <Route path="/" element={<Home />} />
        //   <Route path="/register" element={<Register />} />
        //   <Route path="/login" element={<Login />}  />
        //   <Route path="/chat" element={<WebSocketChat />} loader:chatLoader />
        // </Routes>

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import WebSocketChat from "./components/WebSocketChat";
import { chatLoader } from "./loaders/chatLoader";
import Login from "./pages/Login";
import Register from "./pages/Register";


        const router= createBrowserRouter([

            {path:"/", element:<Home />
            },
            {path:"/register", element:<Register />
            },
            {path:"/login", element:<Login />
            },
            {path:"/chat", element:<WebSocketChat />,
            loader:chatLoader}, 
        ])

export default function AppRouter() {
  return (
    <RouterProvider router={router} />
  );
}