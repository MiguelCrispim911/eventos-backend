document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();  // Evita recargar la página

    const cedula = document.getElementById("cedula").value.trim();
    const contraseña = document.getElementById("contraseña").value.trim();

    try {
        const response = await fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cedula, contraseña })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Inicio de sesión exitoso.");
            localStorage.setItem("usuario", JSON.stringify(data)); 
            window.location.href = "index.html"; 
        } else {
            document.getElementById("error-msg").style.display = "block";
        }
    } catch (error) {
        alert("Error de conexión: " + error.message);
    }
});