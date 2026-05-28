console.log("login.js cargado");

const formulario = document.getElementById("login-formulario");
console.log("Formulario:", formulario);

formulario.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Submit detectado");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("Datos enviados:", { email, password });

    try {
        console.log("Antes del fetch");

        const respuesta = await fetch("http://localhost:3000/api/autenticacion/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        console.log("Después del fetch", respuesta);

        const data = await respuesta.json();
        console.log("Respuesta JSON:", data);

        if (!respuesta.ok) {
            document.getElementById("passwordError").textContent = data.message || "Error al iniciar sesión";
            return;
        }

        // Guardar token y datos del usuario
        localStorage.setItem("token", data.token);
        localStorage.setItem(
            "usuario",
            JSON.stringify({
                id: data.id,
                nombreUsuario: data.nombreUsuario,
                email: data.email,
                roles: data.roles,
            }),
        );

        console.log("Login correcto:", data);

        // Redirigir a la página principal
        window.location.href = "../inicio/panel.html"; // ajusta la ruta según tu estructura
    } catch (error) {
        console.error("Error en fetch:", error);
        document.getElementById("passwordError").textContent = "Error de conexión con el servidor";
    }
});
