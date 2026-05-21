/**
 * BEVS TurnoBank - Lógica de Creación de Turnos
 */
// Variable global para guardar datos
let reservationData = {
    documento: "",
    numeroTelefono: "",
    procedure: "",
    branch: { name: "", address: "" },
    date: "",
    time: "",
};

// 1. Abrir el modal desde el Dashboard
function handleReserve() {
    const modal = document.getElementById("reserve-modal");
    modal.style.display = "flex";
    showStep(1);
}

// 2. Cerrar el modal
function closeReserve() {
    const modal = document.getElementById("reserve-modal");
    modal.style.display = "none";
}

// 3. Control de Navegación entre Pasos
async function showStep(stepNumber) {
    const container = document.getElementById("modal-container");
    try {
        const response = await fetch(`../components/steps_crear_turno/step-${stepNumber}.html`);
        const html = await response.text();

        container.innerHTML = html;
        if (stepNumber === 3) {
            await cargarSucursales();
        }

        const content = container.querySelector(".step-content");
        if (content) {
            content.style.display = "block";
        }
        return true; // <--- AGREGA ESTO para que confirmReservation sepa que terminó
    } catch (error) {
        console.error("Error:", error);
    }
}

// 4. Paso 1 -> Paso 2 (Identificación)
// Paso 1 -> 2
function goToStepTwo() {
    const docInput = document.getElementById("res-doc-number");

    // NUEVO
    const phoneInput = document.getElementById("res-number");

    if (docInput.value.length > 5) {
        reservationData.documento = docInput.value;

        // NUEVO
        reservationData.numeroTelefono = phoneInput.value;

        showStep(2);
    } else {
        alert("Número de documento muy corto.");
    }
}

// Paso 2 -> 3
function selectProcedure(type) {
    reservationData.procedure = type; // <--- GUARDAMOS
    showStep(3);
}

// Paso 3 -> 4
// Paso 3 -> 4 (Selección de Sucursal)
function selectBranch(id, name, address) {
    reservationData.branch = { id, name, address }; // Guardamos el ID también
    showStep(4);
}
// Filtro de búsqueda de sucursales
function filterBranches() {
    let input = document.getElementById("search-branch").value.toLowerCase();
    let cards = document.getElementsByClassName("branch-card");

    for (let card of cards) {
        let text = card.innerText.toLowerCase();
        card.style.display = text.includes(input) ? "flex" : "none";
    }
}

// --- GESTIÓN DE HORARIOS (PASO 4) ---

function loadTimeSlots() {
    const timeSelector = document.getElementById("time-selector");
    const slotsContainer = document.getElementById("time-slots-container");

    slotsContainer.innerHTML = "";
    timeSelector.style.display = "block";

    const hours = ["08:00 AM", "08:30 AM", "09:00 AM", "10:30 AM", "02:00 PM", "03:30 PM"];

    hours.forEach((hour) => {
        const btn = document.createElement("button");
        btn.className = "time-slot";
        btn.innerText = hour;
        btn.onclick = () => selectTimeSlot(btn, hour);
        slotsContainer.appendChild(btn);
    });
}

function selectTimeSlot(element, hour) {
    document.querySelectorAll(".time-slot").forEach((el) => el.classList.remove("selected"));
    element.classList.add("selected");
    selectedTimeSlot = hour;

    const confirmBtn = document.getElementById("btn-final-confirm");
    confirmBtn.disabled = false;
    confirmBtn.style.backgroundColor = "#235347";
    confirmBtn.style.color = "#ffffffff";
}

// --- cargarSucursales (PASO 3) ---
async function cargarSucursales() {
    const container = document.getElementById("branches-container");

    try {
        const response = await fetch("http://localhost:3000/api/sucursales");

        const sucursales = await response.json();

        container.innerHTML = "";

        sucursales.forEach((sucursal) => {
            const card = document.createElement("div");

            card.className = "branch-card";

            card.innerHTML = `
                <div class="branch-info">
                    <i class="fas fa-university branch-icon"></i>

                    <div class="branch-details">
                        <h3>${sucursal.nombre.toUpperCase()}</h3>

                        <p>${sucursal.direccion}</p>

                        <span class="branch-status">
                            ${sucursal.estado ? "Abierto" : "Cerrado"}
                        </span>
                    </div>
                </div>

                <button class="btn-reserve-small">
                    Reservar
                </button>
            `;

            card.onclick = () => selectBranch(sucursal._id, sucursal.nombre, sucursal.direccion);

            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error cargando sucursales:", error);
    }
}

// --- CONFIRMACIÓN FINAL (PASO 5) ---

async function confirmReservation() {
    // 1. Guardar la fecha en el estado global
    reservationData.date = document.getElementById("res-date").value;
    reservationData.time = selectedTimeSlot;

    // 2. Bloquear botón
    const btnConfirm = document.getElementById("btn-final-confirm");
    btnConfirm.disabled = true;

    try {
        // 3. AQUÍ ES DONDE USAS EL FORMATEADOR
        const datosParaEnviar = formatearDatosParaBackend();

        // 4. Llamada al backend con los datos formateados
        await enviarReservaAlBackend(datosParaEnviar);

        // 5. Mostrar resumen
        await showStep(5);

        document.getElementById("final-doc").innerText = reservationData.documento;
        document.getElementById("final-branch").innerText = reservationData.branch.name;
        document.getElementById("final-need").innerText = reservationData.procedure;
        document.getElementById("final-date-time").innerText = `${reservationData.date} - ${reservationData.time}`;
    } catch (error) {
        alert("Hubo un error: " + error.message);
        btnConfirm.disabled = false;
    }
}

// --- GENERACIÓN DE TICKET PNG ---

function descargarTicketPNG() {
    // IMPORTANTE: Asegúrate de que el contenedor de tus datos tenga id="ticket-print"
    const ticket = document.getElementById("ticket-print");

    if (!ticket) {
        alert("No se encontró el contenido del ticket para descargar.");
        return;
    }

    // Estilos temporales para la foto
    const originalPadding = ticket.style.padding;
    ticket.style.padding = "20px";
    ticket.style.backgroundColor = "#ffffff";

    html2canvas(ticket, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
    })
        .then((canvas) => {
            const link = document.createElement("a");
            link.download = `Ticket_BEVS_${Date.now()}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();

            // Restaurar estilos
            ticket.style.padding = originalPadding;
            ticket.style.backgroundColor = "";
        })
        .catch((err) => {
            console.error("Error al generar imagen:", err);
        });
}

// --- COMUNICACIÓN CON EL BACKEND (MICROSERVICIO) ---
async function enviarReservaAlBackend(datos) {
    // AGREGAR ESTO:
    console.log("Objeto que sale del navegador hacia el backend:", JSON.stringify(datos));
    // 1. Obtener el token de localStorage
    const token = localStorage.getItem("token");

    // 2. Definir los headers base
    const headers = {
        "Content-Type": "application/json",
    };

    // 3. Solo añadir el header de autorización si el token existe
    if (token) {
        headers["x-access-token"] = token;
    } else {
        console.warn("No se encontró token en localStorage. La petición podría ser rechazada.");
    }

    try {
        const response = await fetch("http://localhost:3000/api/turnos", {
            method: "POST",
            headers: headers, // Usamos los headers configurados arriba
            body: JSON.stringify(datos),
        });

        if (!response.ok) {
            // Si el error es 401 o 403, probablemente el token expiró
            if (response.status === 401 || response.status === 403) {
                console.error("Token no válido o expirado");
                // Aquí podrías redirigir al login si quisieras
            }
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en el servidor");
        }

        return await response.json();
    } catch (error) {
        console.error("Falla al conectar:", error);
        throw error;
    }
}

// --- UTILIDADES ---

function formatearDatosParaBackend() {
    return {
        fecha: reservationData.date, // "2026-04-21"
        hora: convertirHora24h(reservationData.time), // "08:30"
        sucursal: reservationData.branch.id, // "65f1a..."
        documento: reservationData.documento,
        numeroTelefono: reservationData.numeroTelefono,
        tramite: reservationData.procedure,
    };
}

function convertirHora24h(horaStr) {
    let [hora, minuto, ampm] = horaStr.split(/[: ]/);
    if (ampm === "PM" && hora !== "12") hora = parseInt(hora) + 12;
    if (ampm === "AM" && hora === "12") hora = "00";
    return `${hora.toString().padStart(2, "0")}:${minuto}`;
}

// Listener para el botón amarillo dinámico
document.addEventListener("input", function (e) {
    if (e.target.id === "res-doc-number") {
        const btn = document.querySelector(".btn-continue-reserve");
        if (btn) {
            if (e.target.value.length > 5) {
                btn.style.backgroundColor = "#235347";
                btn.style.color = "#ffffffff";
            } else {
                btn.style.backgroundColor = "#E0E0E0";
                btn.style.color = "#888";
            }
        }
    }
});
