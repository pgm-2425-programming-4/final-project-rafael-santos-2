import React from "react";
import { Outlet } from "@tanstack/react-router";

export default function Root() {
  return (
    <div>
      <header>
        <img src="/vite.svg" alt="Jammin logo" />
      </header>
      <main>
        <Outlet /> {/* Hier worden subroutes gerenderd */}
      </main>
    </div>
  );
}