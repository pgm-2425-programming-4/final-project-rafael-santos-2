import React from "react";
import logo from "../assets/jammin_logo.png";
import text from "../assets/jammin_text.png";
import { Outlet, Link } from '@tanstack/react-router';

function Aside() {
  return (
    <div>
      <header>
        <figure>
          <img src={logo} alt="jammin logo" />
          <img src={text} alt="text logo" />
        </figure>
        <h1>Jammin</h1>
      </header>

      <nav style={{ marginBottom: '1rem', padding: '1rem', background: '#f0f0f0' }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
        <Link to="/about" style={{ marginRight: "1rem" }}>About</Link>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Aside;
