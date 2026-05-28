async function cargarMisTurnos() {
    const tbody = document.getElementById("mis-turnos-body");

    try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:3000/api/turnos", {
            method: "GET",

            headers: {
                "Content-Type": "application/json",
                "x-access-token": token,
            },
        });

        const turnos = await response.json();

        tbody.innerHTML = "";

        turnos.forEach((turno) => {
            const fila = document.createElement("tr");

            const fecha = new Date(turno.fecha).toLocaleDateString();

            fila.innerHTML = `
                <td>${fecha}</td>

                <td>${turno.hora}</td>

                <td>
                    <span class="estado-turno estado-${turno.estado}">
                        ${turno.estado}
                    </span>
                </td>

                <td>
                    <button onclick="cancelarTurno('${turno._id}')">
                        Cancelar
                    </button>
                </td>
            `;

            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error("Error cargando turnos:", error);
    }
}
