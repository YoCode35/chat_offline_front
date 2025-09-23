import { Routes, Route, Link } from "react-router-dom";
import WebSocketChat from "./components/WebSocketChat";
import Register from "./pages/register";
import Login from "./pages/Login";


<><Route path="/register" element={<Register />} />

<Route path="/login" element={<Login />} /></>

function Home() {
  return (
    <div className="home">
      <h1>Chat Off Line</h1>
    </div>
  );
}

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Barre de navigation en haut */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/">Accueil</Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
          <Link to="/chat">Chat</Link>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<WebSocketChat />} />
      </Routes>
    </div>
  );
}

export default App;