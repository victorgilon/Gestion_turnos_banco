// todavia falta mirar conexiones con el backed

//////////////////////////////////////
// 🔐 VALIDACIÓN DE SESIÓN
//////////////////////////////////////

const usuarioGuardado = localStorage.getItem("usuario");

if (!usuarioGuardado) {
    window.location.href = "../pages/login.html";
}

const usuario = JSON.parse(usuarioGuardado);

// Mostrar bienvenida
document.getElementById("welcome-msg").innerText = `Bienvenido, ${usuario.nombreUsuario}`;

//////////////////////////////////////
// 🚪 LOGOUT REAL
//////////////////////////////////////

document.getElementById("logout-btn").addEventListener("click", () => {
    if (confirm("¿Cerrar sesión?")) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        window.location.href = "../login/login.html";
    }
});

//////////////////////////////////////
// 🚀 INICIALIZACIÓN
//////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    renderDashboard("all");
});

//////////////////////////////////////
// 🎯 RENDER DASHBOARD
//////////////////////////////////////

function renderDashboard(filter = "all") {
    const tableBody = document.getElementById("turns-body");
    tableBody.innerHTML = "";

    const filteredTurns = filter === "all" ? turnos : turnos.filter((t) => t.estado === filter);

    filteredTurns.forEach((turno) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${turno.fecha}</td>
            <td>${turno.hora}</td>
            <td>
                <span class="status-tag status-${turno.estado.toLowerCase()}">
                    ${turno.estado}
                </span>
            </td>
            <td>
                ${
                    turno.estado === "Activo"
                        ? `
                        <button class="btn-action" onclick="reprogramar(${turno.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-cancel" onclick="cancelarTurno(${turno.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    `
                        : `<span style="color:#999;">Sin acciones</span>`
                }
            </td>
        `;

        tableBody.appendChild(row);
    });

    actualizarResumen();
    mostrarProximoTurno();

    // 💾 persistencia
    localStorage.setItem("turnos", JSON.stringify(turnos));
}

//////////////////////////////////////
// 📊 RESUMEN
//////////////////////////////////////

function actualizarResumen() {
    document.getElementById("count-active").innerText = turnos.filter((t) => t.estado === "Activo").length;

    document.getElementById("count-completed").innerText = turnos.filter((t) => t.estado === "Completado").length;

    document.getElementById("count-cancelled").innerText = turnos.filter((t) => t.estado === "Cancelado").length;
}

//////////////////////////////////////
// ⏭️ PRÓXIMO TURNO (MEJORADO)
//////////////////////////////////////

function mostrarProximoTurno() {
    const nextTurnContainer = document.getElementById("next-turn-display");

    const proximos = turnos
        .filter((t) => t.estado === "Activo")
        .sort((a, b) => new Date(`${a.fecha} ${a.hora}`) - new Date(`${b.fecha} ${b.hora}`));

    if (proximos.length > 0) {
        const t = proximos[0];

        nextTurnContainer.innerHTML = `
            <p style="font-weight:bold; color:var(--primary-dark)">
                ${t.fecha}
            </p>
            <p style="font-size:1.2rem">${t.hora}</p>
            <small>Sucursal Centro</small>
        `;
    } else {
        nextTurnContainer.innerHTML = `<p class="no-data">No tienes turnos pendientes</p>`;
    }
}

//////////////////////////////////////
// 🎮 ACCIONES
//////////////////////////////////////

function handleReserve() {
    alert("Redirigiendo a formulario de reserva...");
}

function cancelarTurno(id) {
    if (confirm("¿Estás seguro de cancelar este turno?")) {
        const index = turnos.findIndex((t) => t.id === id);

        if (index !== -1) {
            turnos[index].estado = "Cancelado";

            localStorage.setItem("turnos", JSON.stringify(turnos));

            renderDashboard();
        }
    }
}

function reprogramar(id) {
    alert(`Reprogramación simulada del turno ID: ${id}`);
}

//////////////////////////////////////
// 🔎 FILTRO
//////////////////////////////////////

function filterTurns(status) {
    renderDashboard(status);
}

async function cargarMisTurnos() {
    const tbody = document.getElementById("turns-body");

    try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:3000/api/turnos", {
            method: "GET",

            headers: {
                "Content-Type": "application/json",
                "x-access-token": token,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();

            console.log("ERROR BACKEND:", errorData);

            throw new Error(errorData.message);
        }

        const turnos = await response.json();
        console.log(turnos);

        tbody.innerHTML = "";

        if (turnos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4">
                        No tienes turnos registrados
                    </td>
                </tr>
            `;
            return;
        }

        turnos.forEach((turno) => {
            const fila = document.createElement("tr");

            const fecha = new Date(turno.fecha).toLocaleDateString("es-CO");

            fila.innerHTML = `
            
            <td>${fecha}</td>
            <td>${turno.hora}</td>
            <td>${turno.sucursal?.nombre || "Sin sucursal"}</td>
            <td>
                <span class="estado-${turno.estado}">
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

document.addEventListener("DOMContentLoaded", () => {
    cargarMisTurnos();
});
