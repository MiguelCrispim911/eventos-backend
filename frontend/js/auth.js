document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("Usuario en localStorage:", user); // Debugging

    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const userDropdown = document.getElementById("userDropdown");
    const userLink = document.getElementById("userLink");
    const userMenu = document.getElementById("userMenu");
    const logoutBtn = document.getElementById("logoutBtn");

    if (user) {
        console.log("Mostrando opciones de usuario...");

        // Ocultar botones de login y registro
        loginBtn.classList.add("hidden");
        registerBtn.classList.add("hidden");

        // Mostrar el menú de usuario
        userDropdown.style.display = "inline-block";

        // Mostrar número de cédula en lugar del nombre
        userLink.textContent = user.cedula || "Usuario"; 

        // Manejar la apertura/cierre del menú desplegable al pasar el mouse
        userDropdown.addEventListener("mouseenter", function () {
            userMenu.classList.add("show");
        });

        userDropdown.addEventListener("mouseleave", function () {
            userMenu.classList.remove("show");
        });

        // Cerrar sesión
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("user");
            window.location.reload();
        });

    } else {
        console.log("Usuario no logueado, ocultando opciones de usuario.");
        userDropdown.style.display = "none";
    }
});