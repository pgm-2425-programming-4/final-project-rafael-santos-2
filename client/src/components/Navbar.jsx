import { Link } from "@tanstack/react-router";

export default function Navbar() {
  return (
    <nav
      style={{
        backgroundColor: "#f1f2f2",
        padding: "1rem 2rem",
        display: "flex",
        gap: "1.5rem",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Link
        to="/"
        style={{
          color: "#4B0082",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "1.1rem",
        }}
      >
        Home
      </Link>

      <Link
        to="/about"
        style={{
          color: "#4B0082",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "1.1rem",
        }}
      >
        About
      </Link>
    </nav>
  );
}
