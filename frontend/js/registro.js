console.log("registro.js cargado");

const formulario = document.getElementById("registro-formulario");

formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.querySelector('input[name="nombre"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const documento = document.querySelector('input[name="documento"]').value.trim();
    const password = document.querySelector('input[name="password"]').value;
    const confirmar = document.querySelector('input[name="confirmar"]').value;

    // VALIDACIONES
    if (!nombre || !email || !documento || !password || !confirmar) {
        alert("Todos los campos son obligatorios");
        return;
    }

    if (password !== confirmar) {
        alert("Las contraseñas no coinciden");
        return;
    }

    if (password.length < 6) {
        alert("La contraseña debe tener mínimo 6 caracteres");
        return;
    }

    if (!/^\d+$/.test(documento)) {
        alert("El documento debe contener solo números");
        return;
    }

    try {
        console.log("Enviando datos al backend...");

        const respuesta = await fetch("http://localhost:3000/api/autenticacion/registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nombreUsuario: nombre,
                email: email,
                password: password,
                documento: documento,
                //NO se envía rol, el backend lo asigna
            }),
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            alert(data.message || "Error al registrarse");
            return;
        }

        alert("Usuario registrado correctamente");
        window.location.href = "../login/login.html";
    } catch (error) {
        console.error("Error conexión:", error);
        alert("Error de conexión con el servidor");
    }
});
