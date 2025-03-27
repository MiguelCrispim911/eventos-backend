document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = {
        cedula: document.getElementById("cedula").value,
        contrasena: document.getElementById("contraseña").value
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/clientes/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login exitoso");
            localStorage.setItem("user", JSON.stringify(data));  // Guardar datos
            console.log(localStorage.getItem("user"));
            window.location.href = "index.html";
        } else {
            document.getElementById("error-msg").style.display = "block";
        }
    } catch (error) {
        alert(`Error de conexión: ${error.message}`);
    }
});