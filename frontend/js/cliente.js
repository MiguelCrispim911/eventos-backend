document.addEventListener("DOMContentLoaded", () => {
    const formRegistro = document.getElementById("registro-form");

    if (formRegistro) {
        formRegistro.addEventListener("submit", async (event) => {
            event.preventDefault();

            const formData = new FormData(formRegistro);
            const data = {
                cedula: parseInt(formData.get("cedula")),
                nombres: formData.get("nombres"),
                apellidos: formData.get("apellidos"),
                direccion: formData.get("direccion"),
                departamento: formData.get("departamento"),
                municipio: formData.get("municipio"),
                email: formData.get("email"),
                telefono: formData.get("telefono"),
                contrasena: formData.get("contraseña"),
                estado: 1  // Puedes cambiar esto si necesitas un valor dinámico
            };

            try {
                const response = await fetch("http://127.0.0.1:8000/clientes/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (response.ok) {
                    alert("Usuario registrado con éxito.");
                    formRegistro.reset();
                } else {
                    alert("Error al registrar usuario: " + result.detail);
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
                alert("Error en la conexión con el servidor.");
            }
        });
    }
});
