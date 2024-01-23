

function crearProducto(producto) {
    fetch('https://backendalex.azurewebsites.net/productos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            console.log('Producto creado exitosamente');
            location.reload(); // Recarga la página después de crear el producto
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}

function editarProducto(productoId) {
    fetch(`https://backendalex.azurewebsites.net/productos/${productoId}`)
        .then(response => response.json())
        .then(producto => {
            document.getElementById('editId').value = producto.id;
            document.getElementById('editNombre').value = producto.nombre;
            document.getElementById('editPrecio').value = producto.precio;
            document.getElementById('editDescripcion').value = producto.descripcion;
            document.getElementById('editCategoria').value = producto.categoria;
            document.getElementById('editUrlImagen').value = producto.urlImagen;
            document.getElementById('editStock').value = producto.stock;
            abrirModalEditar();
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}

function guardarEdicion() {
    const productoId = document.getElementById('editId').value;
    const nombre = document.getElementById('editNombre').value;
    const precio = document.getElementById('editPrecio').value;
    const descripcion = document.getElementById('editDescripcion').value;
    const categoria = document.getElementById('editCategoria').value;
    const urlImagen = document.getElementById('editUrlImagen').value;
    const stock = document.getElementById('editStock').value;

    const productoEditado = { id: productoId, nombre, precio, descripcion, categoria, urlImagen, stock };

    fetch(`https://backendalex.azurewebsites.net/productos/${productoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productoEditado),
    })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                console.log('Producto editado exitosamente');
                location.reload(); // Recarga la página después de editar el producto
            })
            .catch(error => {
                console.error('Error al guardar la edición:', error.message);
            });
}


function abrirModalEditar() {
    const modalEditar = document.getElementById('modal-editar');
    modalEditar.style.display = 'block';
}

function cerrarModalEditar() {
    const modalEditar = document.getElementById('modal-editar');
    modalEditar.style.display = 'none';
}



function eliminarProducto(productoId) {
    if (confirm("¿Seguro que quieres eliminar este producto?")) {
        fetch(`https://backendalex.azurewebsites.net/productos/${productoId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // No intentes analizar JSON si la solicitud DELETE es exitosa
                if (response.status !== 204) {
                    return response.json();
                }
            })
            .then(() => {
                console.log('Producto eliminado exitosamente');
                location.reload(); // Recarga la página después de eliminar el producto
            })
            .catch(error => {
                console.error('Error al eliminar el producto:', error.message);
            });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // ... Resto del código ...

    function mostrarProductos(productos) {
        const productosSection = document.getElementById('productos');
        productosSection.innerHTML = '';

        const filtro = document.getElementById('buscar').value.toLowerCase();

        productos.forEach(producto => {
            if (producto.nombre.toLowerCase().includes(filtro)) {
                const productoElement = document.createElement('div');
                productoElement.classList.add('producto');

                const imagenLink = obtenerLinkImagen(producto.urlImagen);

                productoElement.innerHTML = `
                    <div class="info-producto">
                        <h3>${producto.nombre}</h3>
                        <p>Precio: ${producto.precio}</p>
                        <p>Descripción: ${producto.descripcion}</p>
                        <p>Categoría: ${producto.categoria}</p>
                        <p>Stock: ${producto.stock}</p>
                    </div>
                    <div class="imagen-producto">
                        <img src="${imagenLink}" alt="${producto.nombre}">
                    </div>
                    <div class="acciones-producto">
                        <button onclick="editarProducto(${producto.id})">Editar</button>
                        <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
                    </div>
                `;
                productosSection.appendChild(productoElement);
            }
        });
    }

    // ... Resto del código ...
});


function realizarBusqueda() {
    const nombre = document.getElementById('buscar-nombre').value;
    const categoria = document.getElementById('categoria-busqueda').value;

    if (nombre) {
        // Realizar búsqueda por nombre
        buscarPorNombre(nombre);
    } else if (categoria) {
        // Realizar búsqueda por categoría
        buscarPorCategoria(categoria);
    } else {
        // Si ambos campos están vacíos, puedes mostrar un mensaje o realizar alguna acción
        console.log('Por favor, ingrese al menos un criterio de búsqueda.');
    }
}

function buscarPorNombre(nombre) {
    fetch(`https://backendalex.azurewebsites.net/productos/nombre/${nombre}`)
        .then(response => response.json())
        .then(data => {
            mostrarProductos(data);
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}


function buscarPorCategoria(categoria) {
    fetch(`https://backendalex.azurewebsites.net/productos/categoria/${categoria}`)
        .then(response => response.json())
        .then(data => {
            mostrarProductos(data);
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}


function buscarPorId(productoId) {
    fetch(`https://backendalex.azurewebsites.net/productos/${productoId}`)
        .then(response => response.json())
        .then(data => {
            // Aquí maneja los datos obtenidos por ID
            console.log(data);
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}


const apiUrl = 'https://backendalex.azurewebsites.net/productos/ids';  // Reemplaza con la URL correcta de tu backend

// Realiza la solicitud al endpoint
fetch(apiUrl)
    .then(response => {
        // Verifica si la respuesta es exitosa (código de estado 200)
        if (!response.ok) {
            throw new Error(`Error al obtener los IDs de productos: ${response.status} ${response.statusText}`);
        }
        // Parsea la respuesta como JSON
        return response.json();
    })
    .then(idsProductos => {
        // Maneja los IDs de productos obtenidos
        console.log('IDs de productos:', idsProductos);
        // Aquí puedes realizar más acciones con los IDs según tus necesidades
    })
    .catch(error => {
        // Maneja cualquier error durante la solicitud
        console.error('Error:', error);
    });