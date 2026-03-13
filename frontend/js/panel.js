// Verificar si existe sesión
const token = localStorage.getItem("token");
const usuarioGuardado = localStorage.getItem("usuario");

// Si no hay token, volver al login
if (!token || !usuarioGuardado) {
    window.location.href = "../pages/login.html";
}

// Obtener datos del usuario
const usuario = JSON.parse(usuarioGuardado);

// Mostrar nombre en el panel
const saludo = document.getElementById("saludo");
saludo.textContent = `Bienvenido, ${usuario.nombreUsuario}`;

// Cerrar sesión
document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "../views/login.html";
});
