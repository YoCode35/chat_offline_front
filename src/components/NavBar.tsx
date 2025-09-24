import { useState } from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className={`nav ${open ? "open" : ""}`}>
      <div className="nav-inner">
        {/* Logo / Home icon */}
        <Link to="/" className="logo-link" onClick={() => setOpen(false)} aria-label="Accueil">
          {/* Icône maison (SVG) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="28"
            height="28"
            role="img"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" fill="currentColor" />
          </svg>
        </Link>

        {/* Hamburger button (visible on small screens) */}
        <button
          className="hamburger"
          onClick={() => setOpen((s) => !s)}
          aria-expanded={open}
          aria-controls="primary-navigation"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {/* Change l'icône selon l'état */}
          {open ? (
            // X (close)
            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
              <path d="M18.3 5.71L12 12l6.3 6.29-1.58 1.42L10.83 13.4 4.54 19.71 2.5 17.67 8.79 11.38 2.5 5.09 4.04 3.55 10.33 9.84 16.62 3.55z" fill="currentColor" />
            </svg>
          ) : (
            // Hamburger
            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
              <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" fill="currentColor" />
            </svg>
          )}
        </button>

        {/* Links */}
        <div id="primary-navigation" className={`nav-links ${open ? "show" : ""}`}>
          <Link to="/register" onClick={() => setOpen(false)}>Register</Link>
          <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
          <Link to="/chat" onClick={() => setOpen(false)}>Chat</Link>
        </div>
      </div>
    </nav>
  );
}