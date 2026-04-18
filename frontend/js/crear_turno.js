/**
 * BEVS TurnoBank - Lógica de Creación de Turnos
 */

// Variables globales para persistencia entre pasos
let selectedTimeSlot = null;
window.selectedProcedure = "";
window.selectedBranch = { name: "", address: "" };

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
function showStep(stepNumber) {
    const steps = document.querySelectorAll(".step-content");
    steps.forEach((step) => (step.style.display = "none"));

    const targetStep = document.getElementById(`step-${stepNumber}`);
    if (targetStep) {
        targetStep.style.display = "block";
    }
}

// 4. Paso 1 -> Paso 2 (Identificación)
function goToStepTwo() {
    const docInput = document.getElementById("res-doc-number");
    if (docInput.value.length > 5) {
        showStep(2);
    } else {
        alert("Por favor, ingresa un número de documento válido.");
    }
}

// 5. Paso 2 -> Paso 3 (Selección de Trámite)
function selectProcedure(type) {
    window.selectedProcedure = type;
    showStep(3);
}

// 6. Paso 3 -> Paso 4 (Selección de Sucursal)
function selectBranch(name, address) {
    window.selectedBranch = { name, address };
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
    confirmBtn.style.backgroundColor = "#FDDA24";
    confirmBtn.style.color = "#000";
}

// --- CONFIRMACIÓN FINAL (PASO 5) ---

function confirmReservation() {
    const finalDoc = document.getElementById("res-doc-number").value;
    const finalDate = document.getElementById("res-date").value;

    // Llenar resumen en la interfaz
    document.getElementById("final-doc").innerText = finalDoc;
    document.getElementById("final-branch").innerText = window.selectedBranch.name;
    document.getElementById("final-need").innerText = window.selectedProcedure;
    document.getElementById("final-date-time").innerText = `${finalDate} - ${selectedTimeSlot}`;

    showStep(5);
    console.log("Enviando evento a RabbitMQ para notification-service...");
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

// Listener para el botón amarillo dinámico
document.addEventListener("input", function (e) {
    if (e.target.id === "res-doc-number") {
        const btn = document.querySelector(".btn-continue-reserve");
        if (btn) {
            if (e.target.value.length > 5) {
                btn.style.backgroundColor = "#FDDA24";
                btn.style.color = "#000";
            } else {
                btn.style.backgroundColor = "#E0E0E0";
                btn.style.color = "#888";
            }
        }
    }
});
