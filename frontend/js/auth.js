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

        // Cambiar el texto del usuario
        userLink.textContent = user.nombres || "Usuario";

        // Manejar la apertura/cierre del menú desplegable
        userLink.addEventListener("click", function (event) {
            event.preventDefault();
            userMenu.classList.toggle("show");
        });

        // Cerrar sesión
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("user");
            window.location.reload();
        });

        // Cerrar el menú si se hace clic fuera de él
        document.addEventListener("click", function (event) {
            if (!userDropdown.contains(event.target)) {
                userMenu.classList.remove("show");
            }
        });

    } else {
        console.log("Usuario no logueado, ocultando opciones de usuario.");
        userDropdown.style.display = "none";
    }
});
