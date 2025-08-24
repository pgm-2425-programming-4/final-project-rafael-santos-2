import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Aside from "./components/aside";

import HomePage from "./pages/Home";
import About from "./pages/About";
import ProjectPage from "./pages/Projects";

function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ display: "flex" }}>
        <Aside />
        <div style={{ flex: 1, padding: "1rem" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </main>
    </Router>
  );
}

export default App;
