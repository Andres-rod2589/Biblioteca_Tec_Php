$(document).ready(()=>{
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
const verificarCampos = () =>{
    //Se verifica que no se tennga un me saje de error 
    if ($('#tituloError').text() || $('#codigoLibroError').text() || $('#mostrarAutoresError').text() || $('#categoriasError').text()) {
        $('#guardar').prop('disabled', true);//desactiva el botn guardar mientras haya errores.
    } else {
        $('#guardar').prop('disabled', false);
    }
};


const mostrarAutorSelect = () => {
    $.ajax({
        url: "../Controller/LibrosController.php",
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

const guardarLibrosDiccionario = () =>{
    let titulo = $('#titulo').val();
    let isbn = $('#codigoLibro').val();
    let categoria = $('#categorias').val();
    let autores = $('#mostrarAutores').val();
    let ejemplares = $('#librosEjemplares').val();

    let guardarLibros ={
        "titulo":titulo,
        "isbn":isbn,
        "categoria":categoria,
        "autor":autores,
        "ejemplares":ejemplares
    };
    return guardarLibros;
}

//-----------------------------------APARTADO PARA MOSTRAR LOS DATOS A LA TABLA Y BOTONES DE ELIMINAR Y ACTUALIZAR-----------------------------------
$('#guardar').on('click', () => {
    let datos = guardarLibrosDiccionario();
    MostrarDatosTabla();
    //PREPARACION DEL PAQUETE "ENVIO"
    $.ajax({
        url: "../Controller/LibrosController.php", //URL, DOMINIO, SERVIDOR
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
                MostrarDatosTabla(); // Mostrara los datos recien agragados si la insercion fue correcta si neceidad de recargar la pagina
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

const BtnActualizar = (codigoAutor) => {
    return `<button class="btn btn-warning btn-actualizar" data-bs-toggle="modal" data-codigoAutor="${codigoAutor}" data-bs-target="#modalActualizar">Actualizar</button>`;
};


//--------------------------------------FUNCION PARA CREAR UNA FILA DE LA TABLA------------------------
const FilasTablaLibros = (libros) => {
    return `
        <tr>
            <td>${libros.nombre}</td>
            <td>${libros.isbn}</td>
            <td>${libros.categoria}</td>
            <td>${libros.autores}</td>
            <td>${libros.total_ejemplares}
            <td>${BtnActualizar(libros.codigoAutor)}</td>
            <td>${BtnEliminar(libros.isbn)}</td>
        </tr>`;
};


//--------------------------------------FUNCION PARA MOSTRAR DATOS EN LA TABLA------------------------
const MostrarDatosTabla = () => {
    $('#MostrarLibros').empty(); // Limpia las filas si es que llegan a duplicar

    $.ajax({
        url: "../Controller/LibrosController.php", 
        method: "POST", 
        data: { peticion: "All_Libros" }, 
        dataType: "json", 
        success: function (respuesta) {
            if (respuesta.estado) { 
                respuesta.datos.forEach(libros => {
                    $('#MostrarLibros').append(FilasTablaLibros(libros));
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

const eliminarLibro = (isbn) => {
    console.log("Eliminando libro con ISBN:", isbn);
    $.ajax({
        url: "../Controller/LibrosController.php",
        method: "POST",
        data: { peticion: "Eliminar_Libros", paquete: { isbn: isbn } },
        dataType: "json",
        success: function (respuesta) {
            console.log("Respuesta del servidor:", respuesta);
            Swal.fire(
                respuesta.estado ? '¡Éxito!' : '¡Error!',
                respuesta.estado ? 'Libro eliminado correctamente' : respuesta.MSG,
                respuesta.estado ? 'success' : 'error'
            );
            if (respuesta.estado) {
                MostrarDatosTabla();
            }
        },
        error: function (xhr, status, error) {
            console.log("Error AJAX:", xhr, status, error);
            Swal.fire('Error', 'No se pudo eliminar el autor', 'error');
        }
    });
};


$('#buscador').on('keyup', () => {
    let buscarTexto = $('#buscador').val(); // Obtiene lo que el usuario escribe
    console.log("Texto buscado:", buscarTexto); 

    $('#mostrarLibros tr').each(function () { // Se itera cada fila que tiene la tabla con each de JQuery
        let textoTabla = $(this).text(); // Obtiene el texto de la fila pero por separado, por concepto

        if (textoTabla.includes(buscarTexto)) { // Si el texto de la fila contiene lo que escribi
            $(this).show(); // Muestra la fila, show hace que el elmento sea visible
        } else {
            $(this).hide(); // Si no, oculta la fila, hide hace que los elementos se oculten
        }
    });
});

