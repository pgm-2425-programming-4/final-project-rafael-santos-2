import React from "react";

function header() {
  return (
    <header>
      <nav>
        <form action="">
          <label htmlFor="choise" />
          <select name="choice" id="choice" defaultValue="Default">
            <option value="Default">Default</option>
            <option value="Back-end">Back-end</option>
            <option value="Front-end">Front-end</option>
          </select>
          <label htmlFor="textInput" />
          <input
            type="search"
            id="textInput"
            name="textInput"
            placeholder="Search by description..."
          />
        </form>
        <nav>
          <h1>Active project: PGM3</h1>
          <button>Add new task</button>
          <button>Add new product</button>
          <button>View backlog</button>
        </nav>
      </nav>
    </header>
  );
}

export default header;
