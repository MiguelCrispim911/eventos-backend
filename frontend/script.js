
document.addEventListener("DOMContentLoaded", () => {
    console.log("Plataforma de Venta de Boletos cargada");

    // Simulación de eventos
    const eventos = [
        { nombre: "Concierto de Rock", fecha: "2025-05-20", lugar: "Estadio Nacional" },
        { nombre: "Partido de Fútbol", fecha: "2025-06-10", lugar: "Arena Central" },
        { nombre: "Obra de Teatro", fecha: "2025-07-15", lugar: "Teatro Principal" }
    ];
    
    const eventosContainer = document.getElementById("eventos-container");
    if (eventosContainer) {
        eventos.forEach(evento => {
            const card = document.createElement("div");
            card.classList.add("event-card");
            card.innerHTML = `
                <h3>${evento.nombre}</h3>
                <p><strong>Fecha:</strong> ${evento.fecha}</p>
                <p><strong>Lugar:</strong> ${evento.lugar}</p>
                <button class="btn">Comprar Boletos</button>
            `;
            eventosContainer.appendChild(card);
        });
    }
    
    // Manejo de formularios de login y registro
    document.querySelectorAll("form").forEach(form => {
        form.addEventListener("submit", event => {
            event.preventDefault();
            alert("Formulario enviado exitosamente.");
        });
    });
});



