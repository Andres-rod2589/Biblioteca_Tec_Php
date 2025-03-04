$(document).ready(() => {
    $('#titulo').on('keyup', () => {
        let inputTitulo = $('#titulo').val();
        const validacionLetras = /^[a-zA-ZáéíóúÁÉÍÓÚ\s0-9¡!¿?,]*$/;

        if (inputTitulo.trim() == "") { //EL CAMPO NO DEBE ESTAR VACIO
            $('#tituloError').text('Campo obligatorrio');
        } else if (validacionLetras.test(inputTitulo)) {
            $('#tituloError').text('');
        } else {
            $('#tituloError').text('Caracter no autorizado');
        }
        verificarCampos();
    });

    $('#codigoLibro').on('keyup', () => {
        let inputValor = $('#codigoLibro').val();
        const validacionCodigo = /^[0-9]*$/;

        if (inputValor.trim() == "") {
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

    $('#mostrarAutores').on('change', () => {
        let seleccion = $('#mostrarAutores').val();
        if (seleccion == "") { 
            $('#mostrarAutoresError').text('Selecciona el autor');
        } else {
            $('#mostrarAutoresError').text('');
        }
        verificarCampos()
    });

    $('#categorias').on('change', () => {
        let seleccion = $('#categorias').val();
        if (seleccion == "") { 
            $('#categoriasError').text('Selecciona la categoria.');
        } else {
            $('#categoriasError').text('');
        }
        verificarCampos();
    });

    let seleccion = $('#mostrarAutores, #categorias').val();
    if (seleccion == "") {
        $('#mostrarAutoresError, #categoriasError').text('Selecciona correctamente');
    }

    verificarCampos();
    mostrarAutorSelect();
    MostrarDatosTabla();
})

//VERIFICAR TODOS LOS CAMPOS PARA QUE NO TENGAN LOS TEXTOS DE ERROR
const verificarCampos = () => {
    //Se verifica que no se tenga un mensaje de error 
    if ($('#tituloError').text() || $('#codigoLibroError').text() || $('#mostrarAutoresError').text() || $('#categoriasError').text()) {
        $('#guardar').prop('disabled', true); //desactiva el botón guardar mientras haya errores.
    } else {
        $('#guardar').prop('disabled', false);
    }
};

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

//TABLA-----------------------------------
$('#guardar').on('click', () => {
    let datos = guardarLibrosDiccionario();
    MostrarDatosTabla();
    $.ajax({
        url: "../Controller/LibrosControlador.php", //URL, DOMINIO, SERVIDOR
        method: "POST", // VA A HACER PRIVADO EL METODO DE VIAJE: POST , GET, PUT, DELETE
        data: { peticion: "Insertar_Libros", paquete: datos }, //PAQUETES DE DATOS
        dataType: "json", //DE QUE TIPO ES EL PAQUETE
        success: function (respuesta) { //ESTO ES LA RESPUESTA
            Swal.fire(
                respuesta.estado ? '¡Éxito!' : '¡Error!',
                respuesta.MSG,
                respuesta.estado ? 'success' : 'error'
            );
            if (respuesta.estado) { 
                MostrarDatosTabla(); // Mostrara los datos recien agragados si la insercion fue correcta sin necesidad de recargar la pagina
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

//-------------------------------------------------BOTONES DE LAS ACCIONES DE LA TABLA "actualizar" "eliminar"------------------
const BtnEliminar = (isbn) => {
    return `<button class="btn btn-danger" onclick="eliminarLibro('${isbn}')">Eliminar</button>`;
};

const BtnActualizar = () => {
    return '<button class="btn btn-warning btn-actualizar" data-bs-toggle="modal" data-bs-target="#modalActualizar">Actualizar</button>';
};

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
                        MostrarDatosTabla(); // Actualiza la tabla después de eliminar
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

//--------------------------------------FUNCION PARA CREAR UNA FILA DE LA TABLA------------------------
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

//--------------------------------------FUNCION PARA MOSTRAR DATOS EN LA TABLA------------------------
const MostrarDatosTabla = () => {
    $('#mostrarLibros').empty(); // Limpia las filas si es que llegan a duplicar

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

//------Mostrar datos en la tabla de autores en el modal de actualizar
$(document).on('click', '.btn-actualizar', (event) => {
    const btn = event.currentTarget;
    let fila = $(btn).closest('tr');

    let titulo = fila.find('td:nth-child(1)').text();
    let isbn = fila.find('td:nth-child(2)').text();
    let categoria = fila.find('td:nth-child(3)').text();
    let autorNombre = fila.find('td:nth-child(4)').text().trim();

    // LLENANDO LOS INPUTS DEL MODAL
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

// Función para actualizar los datos del libro
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
                MostrarDatosTabla(); // Actualiza la tabla con los datos actualizados
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