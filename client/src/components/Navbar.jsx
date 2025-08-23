import { Link } from "@tanstack/react-router";

const Navbar = () => {
  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>
        Home
      </Link>
      <Link to="/about">About</Link>
    </nav>
  );
};

export default Navbar;