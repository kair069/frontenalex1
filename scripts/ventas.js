document.addEventListener("DOMContentLoaded", function () {
    //const apiUrl = "https://dockermicroservicio.azurewebsites.net/ventas";
    const apiUrl = "http://localhost:8081/ventas";
    const ventaForm = document.getElementById("ventaForm");
    const ventasTable = document.getElementById("ventasTable");
    const ventasBody = document.getElementById("ventasBody");

    // Función para cargar las ventas al cargar la página
    function cargarVentas() {
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => mostrarVentas(data))
            .catch((error) => console.error("Error al cargar las ventas:", error));
    }

    // Función para mostrar las ventas en la tabla
    function mostrarVentas(ventas) {
        ventasBody.innerHTML = "";
        ventas.forEach((venta) => {
            const row = document.createElement("tr");
            // Añadir las demás columnas según tu modelo Venta
            row.innerHTML = `
                <td>${venta.id}</td>
                <td>${venta.marcaVehiculo}</td>
                <td>${venta.modeloVehiculo}</td>
                <td>${venta.anoVehiculo}</td>
                <td>${venta.tipoAceite}</td>
                <td>${venta.cantidadAceite}</td>
                <td>${venta.kilometrajeActual}</td>
                <td>${venta.cambioFiltroAceite}</td>
                <td>${venta.cambioOtrosFluidos}</td>
                <td>${venta.notasInspeccion}</td>
                <td>${venta.costoAceite}</td>
                <td>${venta.costoServicio}</td>
                <td>${venta.estadoVehiculo}</td>
                <td>${venta.recomendaciones}</td>
                <td>${venta.tecnicoEncargado}</td>
                <td>${venta.fechaVenta}</td>
                <td>
                
                <button onclick="eliminarVenta(${venta.id})">Eliminar</button>
            </td>
            `;
            ventasBody.appendChild(row);
        });
    }

    // Manejar el envío del formulario para crear una nueva venta
    ventaForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(ventaForm);
        const ventaData = {};
        formData.forEach((value, key) => {
            // Asegurarse de formatear la fecha correctamente
            if (key === 'fechaVenta') {
                const fechaVenta = new Date(value);
                ventaData[key] = fechaVenta.toISOString();
            } else {
                ventaData[key] = value;
            }
        });

        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(ventaData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                cargarVentas(); // Recargar las ventas después de la creación exitosa
                ventaForm.reset(); // Resetear el formulario
            })
            .catch((error) => console.error("Error al crear la venta:", error));
    });

    // Cargar las ventas al cargar la página
    cargarVentas();
});

function eliminarVenta(id) {
    // Preguntar al usuario para confirmar la eliminación
    if (confirm("¿Estás seguro de que deseas eliminar esta venta?")) {
        const apiUrl = `http://localhost:8081/ventas/${id}`;

        // Realizar la solicitud DELETE al backend
        fetch(apiUrl, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                // Actualizar la lista de ventas después de la eliminación exitosa
                cargarVentas();
            })
            .catch((error) => console.error("Error al eliminar la venta:", error));
    }
}



// Variables globales para almacenar datos de la venta actualmente editada
let ventaActualId = null;

function editarVenta(id) {
    const apiUrl = `http://localhost:8081/ventas/${id}`;

    // Realiza la solicitud GET al backend para obtener los datos de la venta
    fetch(apiUrl)
        .then((response) => response.json())
        .then((venta) => {
            // Almacena el ID de la venta actualmente editada
            ventaActualId = venta.id;

            // Llena el formulario modal con los datos de la venta
            document.getElementById("editMarcaVehiculo").value = venta.marcaVehiculo;
            document.getElementById("editModeloVehiculo").value = venta.modeloVehiculo;
            // Llena aquí los demás campos necesarios para la edición

            // Muestra el formulario modal
            document.getElementById("modalEditar").style.display = "block";
        })
        .catch((error) => console.error("Error al obtener los datos de la venta:", error));
}

// Función para guardar los cambios después de la edición
function guardarCambios() {
    // Obtén los valores del formulario modal
    const editMarcaVehiculo = document.getElementById("editMarcaVehiculo").value;
    const editModeloVehiculo = document.getElementById("editModeloVehiculo").value;
    // Obtiene aquí los demás valores necesarios para la edición

    // Construye la URL de la solicitud PUT para actualizar la venta
    const apiUrl = `http://localhost:8081/ventas/${ventaActualId}`;

    // Construye el objeto con la información actualizada
    const ventaActualizada = {
        marcaVehiculo: editMarcaVehiculo,
        modeloVehiculo: editModeloVehiculo,
        // Agrega aquí los demás campos necesarios para la edición
    };

    // Realiza la solicitud PUT al backend para actualizar la venta
    fetch(apiUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(ventaActualizada),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Oculta el formulario modal después de la edición exitosa
            document.getElementById("modalEditar").style.display = "none";
            // Actualiza la lista de ventas después de la edición
            cargarVentas();
        })
        .catch((error) => console.error("Error al guardar los cambios:", error));
}