import React from "react";
import logo from "../assets/jammin_logo.png";
import text from "../assets/jammin_text.png";

function Aside({ onSelectProject }) {
  return (
    <aside>
      <figure>
        <img src={logo} alt="jammin logo" />
        <img src={text} alt="text logo" />
      </figure>

      <article>
        <h3>PROJECTS</h3>
        <button onClick={() => onSelectProject("PGM3")}>PGM3</button>
        <button onClick={() => onSelectProject("PGM4")}>PGM4</button>
      </article>

      <article>
        <button>Login</button>
      </article>
    </aside>
  );
}

export default Aside;
