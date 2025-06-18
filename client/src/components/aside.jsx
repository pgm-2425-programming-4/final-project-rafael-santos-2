import React from "react";
import logo from "../assets/jammin_logo.png";
import text from "../assets/jammin_text.png";

function Aside() {
  return (
    <aside>
      <figure>
        <img src={logo} alt="jammin logo" />
        <img src={text} alt="text logo" />
      </figure>
    </aside>
  );
}

export default Aside;
