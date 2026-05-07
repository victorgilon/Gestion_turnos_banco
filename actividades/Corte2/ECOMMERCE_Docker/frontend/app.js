const API_URL = "http://localhost:3000/api/productos";

const form = document.getElementById("productoForm");
const nombreInput = document.getElementById("nombre");
const precioInput = document.getElementById("precio");
const mensaje = document.getElementById("mensaje");
const listaProductos = document.getElementById("listaProductos");
const recargarBtn = document.getElementById("recargarBtn");

async function cargarProductos() {
    try {
        const response = await fetch(API_URL);
        const productos = await response.json();

        if (!Array.isArray(productos) || productos.length === 0) {
            listaProductos.innerHTML = "<p>No hay productos registrados todavía.</p>";
            return;
        }

        listaProductos.innerHTML = productos
            .map(
                (producto) => `
          <article class="item">
            <div class="item-info">
              <strong>${producto.nombre}</strong>
              <span>Precio: $${Number(producto.precio).toLocaleString("es-CO")}</span>
            </div>
            <button class="eliminar" onclick="eliminarProducto(${producto.id})">Eliminar</button>
          </article>
        `,
            )
            .join("");
    } catch (error) {
        listaProductos.innerHTML = "<p>No se pudo cargar la lista de productos.</p>";
    }
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nuevoProducto = {
        nombre: nombreInput.value.trim(),
        precio: precioInput.value.trim(),
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(nuevoProducto),
        });

        const data = await response.json();

        if (!response.ok) {
            mensaje.textContent = data.error || "No se pudo guardar el producto.";
            return;
        }

        mensaje.textContent = "Producto guardado correctamente.";
        form.reset();
        await cargarProductos();
    } catch (error) {
        mensaje.textContent = "Error al conectar con el backend.";
    }
});

async function eliminarProducto(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });

        const data = await response.json();
        mensaje.textContent = data.mensaje || data.error;
        await cargarProductos();
    } catch (error) {
        mensaje.textContent = "No se pudo eliminar el producto.";
    }
}

recargarBtn.addEventListener("click", cargarProductos);

cargarProductos();
