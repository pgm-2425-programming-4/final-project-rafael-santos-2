import React from "react";

export default function AboutPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Over Jammin</h1>
      <p style={{ maxWidth: "700px", lineHeight: "1.6", marginTop: "1rem" }}>
        <strong>Jammin</strong> is een eenvoudige maar krachtige projectmanagementtool
        waarmee je projecten en taken kunt organiseren via een overzichtelijk kanban-bord.
        Het is ontworpen om studenten, ontwikkelaars en teams te helpen hun werk te structureren
        en overzicht te bewaren.
      </p>

      <h2 style={{ marginTop: "2rem" }}>Hoe werkt het?</h2>
      <ul style={{ maxWidth: "700px", lineHeight: "1.6", marginTop: "1rem" }}>
        <li> Maak een nieuw project aan op de homepagina.</li>
        <li> Klik op een project om taken toe te voegen of te beheren.</li>
        <li> Taken kunnen worden gesorteerd per status (Backlog, To do, In progress, enz.).</li>
        <li> Je kan de status van een taak aanpassen of de taak bewerken/verwijderen.</li>
        <li> Gebruik de navigatie bovenaan om eenvoudig tussen pagina's te wisselen.</li>
      </ul>

      <h2 style={{ marginTop: "2rem" }}>Voor wie is Jammin?</h2>
      <p style={{ maxWidth: "700px", lineHeight: "1.6", marginTop: "1rem" }}>
        Jammin is ideaal voor wie op zoek is naar een simpele en intuïtieve manier om werk te organiseren.
        Of je nu een student bent die aan groepsprojecten werkt, of een developer die taken wil opvolgen —
        Jammin helpt je productief te blijven.
      </p>
    </div>
  );
}
