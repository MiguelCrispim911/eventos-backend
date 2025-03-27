document.addEventListener("DOMContentLoaded", async function () {
    const usuario = JSON.parse(localStorage.getItem("user"));
    console.log("Usuario en localStorage:", usuario); // Debugging

    const historialCompras = document.getElementById("historial-compras");

    if (!usuario || !usuario.user) {
        historialCompras.innerHTML = "<p>No has iniciado sesión.</p>";
        return;
    }

    try {
        // Hacer la solicitud a la API para obtener las compras del usuario
        const response = await fetch(`http://127.0.0.1:8000/compras/cedula/${usuario.user}`);
        
        if (!response.ok) {
            throw new Error("Error al obtener las compras.");
        }

        const compras = await response.json();

        if (compras.length === 0) {
            historialCompras.innerHTML = "<p>No tienes compras registradas.</p>";
            return;
        }

        // Construir la tabla con los datos
        let tabla = `
            <table>
                <thead>
                    <tr>
                        <th>ID Compra</th>
                        <th>Fecha</th>
                        <th>Cantidad</th>
                        <th>Forma de Pago</th>
                        <th>Tipo de Boleta</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
        `;

        compras.forEach(compra => {
            tabla += `
                <tr>
                    <td>${compra.idcompra}</td>
                    <td>${compra.fecha}</td>
                    <td>${compra.cantidad}</td>
                    <td>${compra.forma_pago}</td>
                    <td>${compra.id_tipoboleta}</td>
                    <td>${compra.estado === 1 ? "Confirmada" : "Pendiente"}</td>
                </tr>
            `;
        });

        tabla += `</tbody></table>`;
        historialCompras.innerHTML = tabla;

    } catch (error) {
        console.error("Error cargando compras:", error);
        historialCompras.innerHTML = "<p>Error al cargar el historial de compras.</p>";
    }
});