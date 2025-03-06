$(document).ready(() => {
    // Valida el campo de entrada del título
    $('#titulo').on('keyup', () => {
        let inputTitulo = $('#titulo').val();
        const validacionLetras = /^[a-zA-ZáéíóúÁÉÍÓÚ\s0-9¡!¿?,]*$/;

        if (inputTitulo.trim() == "") { // El campo no debe estar vacío
            $('#tituloError').text('Campo obligatorrio');
        } else if (validacionLetras.test(inputTitulo)) {
            $('#tituloError').text('');
        } else {
            $('#tituloError').text('Caracter no autorizado');
        }
        verificarCampos();
    });

    // Valida el campo de entrada del código del libro
    $('#codigoLibro').on('keyup', () => {
        let inputValor = $('#codigoLibro').val();
        const validacionCodigo = /^[0-9]*$/;

        if (inputValor.trim() == "") { // El campo no debe estar vacío
            $('#codigoLibroError').text('Campo obligatorio');
        } else if (!validacionCodigo.test(inputValor)) {
            $('#codigoLibroError').text('Solo numeros');
        } else if (inputValor.length < 10) {
            $('#codigoLibroError').text('Minimo 10 caracteres');
        } else if (inputValor.length > 13) {
            $('#codigoLibroError').text('No puede tenr mas 13 caracteres');
        } else {
            $('#codigoLibroError').text('');
        }
        verificarCampos();
    });

    // Valida el campo de selección de autores
    $('#mostrarAutores').on('change', () => {
        let seleccion = $('#mostrarAutores').val();
        if (seleccion == "") { // El campo no debe estar vacío
            $('#mostrarAutoresError').text('Selecciona el autor');
        } else {
            $('#mostrarAutoresError').text('');
        }
        verificarCampos()
    });

    // Valida el campo de selección de categorías
    $('#categorias').on('change', () => {
        let seleccion = $('#categorias').val();
        if (seleccion == "") { // El campo no debe estar vacío
            $('#categoriasError').text('Selecciona la categoria.');
        } else {
            $('#categoriasError').text('');
        }
        verificarCampos();
    });

    // Validación inicial para los campos de selección de autores y categorías
    let seleccion = $('#mostrarAutores, #categorias').val();
    if (seleccion == "") {
        $('#mostrarAutoresError, #categoriasError').text('Selecciona correctamente');
    }

    verificarCampos();
    mostrarAutorSelect();
    MostrarDatosTabla();
})

// Verifica que no haya mensajes de error en ningún campo
const verificarCampos = () => {
    if ($('#tituloError').text() || $('#codigoLibroError').text() || $('#mostrarAutoresError').text() || $('#categoriasError').text()) {
        $('#guardar').prop('disabled', true); // Desactiva el botón de guardar si hay errores
    } else {
        $('#guardar').prop('disabled', false);
    }
};

// Obtiene y muestra los autores en el campo de selección
const mostrarAutorSelect = () => {
    $.ajax({
        url: "../Controller/LibrosControlador.php",
        method: "POST", 
        data: { peticion: "All_Autores" }, 
        dataType: "json", 
        success: function (respuesta) {
            if (respuesta.estado) { 
                respuesta.datos.forEach(autor => {
                    $('#mostrarAutores, #mostrarAutoresActualizar').append(`<option value="${autor.codigoAutor}">${autor.nombre_completo}</option>`);
                });
            } else {
                respuesta.MSG;
            }
        },
        error: function (xhr, status, error) {
            console.error('Error en AJAX:', status);
            'Intentalo más tarde';
        }
    });
};

// Recoge los datos del libro de los campos de entrada en un diccionario
const guardarLibrosDiccionario = () => {
    let titulo = $('#titulo').val();
    let isbn = $('#codigoLibro').val();
    let categoria = $('#categorias').val();
    let autores = $('#mostrarAutores').val();

    let guardarLibros = {
        "titulo": titulo,
        "isbn": isbn,
        "categoria": categoria,
        "autor": autores,
    };
    return guardarLibros;
}

// Maneja el evento de clic del botón de guardar para guardar los datos del libro
$('#guardar').on('click', () => {
    let datos = guardarLibrosDiccionario();
    MostrarDatosTabla();
    $.ajax({
        url: "../Controller/LibrosControlador.php", // URL, dominio, servidor
        method: "POST", // Método HTTP: POST, GET, PUT, DELETE
        data: { peticion: "Insertar_Libros", paquete: datos }, // Paquete de datos
        dataType: "json", // Tipo de datos
        success: function (respuesta) { // Manejador de respuesta
            Swal.fire(
                respuesta.estado ? '¡Éxito!' : '¡Error!',
                respuesta.MSG,
                respuesta.estado ? 'success' : 'error'
            );
            if (respuesta.estado) { 
                MostrarDatosTabla(); // Refresca la tabla con los nuevos datos si la inserción fue exitosa
            }
            $('#guardarModal').modal('hide');
        },
        error: function (xhr, status, error) {
            console.error('Error:', xhr, status, error);
            Swal.fire(
                '¡Algo salió mal!',
                'Hubo un problema con la solicitud. Inténtalo de nuevo.',
                'warning'
            );
        }
    });

    $('#titulo, #codigoLibro').val('');
    $('#categorias,  #mostrarAutores').val('');
    let seleccion = $('#categorias, #mostrarAutores').val();
    if (seleccion == "") {
        $('#categoriasError, #mostrarAutoresError').text('Selecciona la opcion correspondiente');
    }
    verificarCampos();
});

// Genera el botón de eliminar para cada fila en la tabla
const BtnEliminar = (isbn) => {
    return `<button class="btn btn-danger" onclick="eliminarLibro('${isbn}')">Eliminar</button>`;
};

// Genera el botón de actualizar para cada fila en la tabla
const BtnActualizar = () => {
    return '<button class="btn btn-warning btn-actualizar" data-bs-toggle="modal" data-bs-target="#modalActualizar">Actualizar</button>';
};

// Maneja la acción de eliminar un libro
const eliminarLibro = (isbn) => {
    console.log(isbn)
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "../Controller/LibrosControlador.php",
                method: "POST",
                data: { peticion: " ", paquete: { isbn: isbn } },
                dataType: "json",
                success: function (respuesta) {
                    Swal.fire(
                        respuesta.estado ? '¡Eliminado!' : '¡Error!',
                        respuesta.MSG,
                        respuesta.estado ? 'success' : 'error'
                    );
                    if (respuesta.estado) {
                        MostrarDatosTabla(); // Refresca la tabla después de eliminar
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Error:', xhr, status, error);
                    Swal.fire(
                        '¡Algo salió mal!',
                        'Hubo un problema con la solicitud. Inténtalo de nuevo.',
                        'warning'
                    );
                }
            });
        }
    });
};

// Crea una fila de tabla para cada libro
const FilasTablaLibros = (libros) => {
    return `
        <tr>
            <td>${libros.nombre}</td>
            <td>${libros.isbn}</td>
            <td>${libros.categoria}</td>
            <td>${libros.autores}</td>
            <td>${BtnActualizar()}</td>
            <td>${BtnEliminar(libros.isbn)}</td>
        </tr>`;
};

// Obtiene y muestra los datos de los libros en la tabla
const MostrarDatosTabla = () => {
    $('#mostrarLibros').empty(); // Limpia las filas de la tabla para evitar duplicados

    $.ajax({
        url: "../Controller/LibrosControlador.php", 
        method: "POST", 
        data: { peticion: "All_Libros" }, 
        dataType: "json", 
        success: function (respuesta) {
            if (respuesta.estado) { 
                respuesta.datos.forEach(libros => {
                    $('#mostrarLibros').append(FilasTablaLibros(libros));
                });
            } else {
                respuesta.MSG;
            }
        },
        error: function (xhr, status, error) {
            console.error('Error en AJAX:', status, error);
            console.log('Inténtalo más tarde');
        }
    });
};

// Maneja el evento de clic del botón de actualizar para llenar el modal de actualización con los datos del libro
$(document).on('click', '.btn-actualizar', (event) => {
    const btn = event.currentTarget;
    let fila = $(btn).closest('tr');

    let titulo = fila.find('td:nth-child(1)').text();
    let isbn = fila.find('td:nth-child(2)').text();
    let categoria = fila.find('td:nth-child(3)').text();
    let autorNombre = fila.find('td:nth-child(4)').text().trim();

    // Llena los campos de entrada del modal de actualización
    $('#tituloActualizar').val(titulo);
    $('#codigoLibroActualizar').val(isbn);
    $('#categoriasActualizar').val(categoria);
    
    // Selecciona la opción correcta en el campo de selección de autores
    $('#mostrarAutoresActualizar option').each(function() {
        if ($(this).text().trim() === autorNombre) {
            $(this).prop('selected', true);
        }
    });

    $('#codigoLibro').val(isbn);
});

// Maneja el evento de clic del botón de guardar para actualizar los datos del libro
$('#guardarActualizar').on('click', () => {
    let datos = {
        titulo: $('#tituloActualizar').val(),
        isbn: $('#codigoLibro').val(),
        categoria: $('#categoriasActualizar').val(),
        autor: $('#mostrarAutoresActualizar').val(),
        isbn_nuevo: $('#codigoLibroActualizar').val()
    };

    $.ajax({
        url: "../Controller/LibrosControlador.php",
        method: "POST",
        data: { peticion: "Actualizar_Libros", paquete: datos },
        dataType: "json",
        success: function (respuesta) {
            Swal.fire(
                respuesta.estado ? '¡Éxito!' : '¡Error!',
                respuesta.MSG,
                respuesta.estado ? 'success' : 'error'
            );
            if (respuesta.estado) {
                MostrarDatosTabla(); // Refresca la tabla con los datos actualizados
            }
            $('#modalActualizar').modal('hide');
        },
        error: function (xhr, status, error) {
            console.error('Error:', xhr, status, error);
            Swal.fire(
                '¡Algo salió mal!',
                'Hubo un problema con la solicitud. Inténtalo de nuevo.',
                'warning'
            );
        }
    });
});