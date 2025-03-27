document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("cambiar-contrasena-form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const usuario = JSON.parse(localStorage.getItem("user")); // Obtener usuario del localStorage
        if (!usuario) {
            alert("Debes iniciar sesión primero.");
            return;
        }

        const contrasenaActual = document.getElementById("contraseñaActual").value;
        const nuevaContrasena = document.getElementById("nuevaContraseña").value;
        const confirmarContrasena = document.getElementById("confirmarContraseña").value;

        if (nuevaContrasena !== confirmarContrasena) {
            alert("Las contraseñas nuevas no coinciden.");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/clientes/cambiar_contrasena", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cedula: usuario.user,
                    contrasena_actual: contrasenaActual,
                    nueva_contrasena: nuevaContrasena,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || "Error al cambiar la contraseña.");
            }

            alert("Contraseña cambiada con éxito.");
            form.reset();
        } catch (error) {
            alert(error.message);
        }
    });
});