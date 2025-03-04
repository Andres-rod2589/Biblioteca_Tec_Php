$(document).ready(() => { 
    $('#nombre, #ap_paterno, #ap_materno').on('keyup', function() {
        let inputValor = $(this).val(); // Obtener los valores de los 3 inputs
        const validacionLetras = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]*$/; //Se validan las letras mayusculas y minusculas con acentos para noombres
        let MensajeError = '';

        if (!validacionLetras.test(inputValor)) {
            MensajeError = 'Solo se permiten letras';
        }

        if (this.id == 'nombre') {
            $('#nombreError').text(MensajeError);
        } else if (this.id == 'ap_paterno') {
            $('#ap_paternoError').text(MensajeError);
        } else if (this.id == 'ap_materno') {
            $('#ap_maternoError').text(MensajeError);
        }
        verificarCampos();
    });

    $('#codigo_autor').on('keyup', () =>  {
        let inputValor = $('#codigo_autor').val();
        const validacionLetras = /^[A-Z0-9]*$/;

        if (validacionLetras.test(inputValor)) {
            $('#codigo_autorError').text('');
        } else {
            $('#codigo_autorError').text('Solo letras mayusculas y numeros.');
        }
        verificarCampos();
    });

    $('#nacionalidad').on('change', () => {
        let seleccion = $('#nacionalidad').val();
        if (seleccion == "") { 
            $('#nacionalidadError').text('Selecciona una nacionalidad.');
        } else {
            $('#nacionalidadError').text('');
        }
        verificarCampos();
    });

    let seleccion = $('#nacionalidad').val();
    if (seleccion == "") {
        $('#nacionalidadError').text('Selecciona una nacionalidad.');
    }
    
    verificarCampos();
    MostrarDatosTabla();

});

const verificarCampos = () => {
    //Se verifica que no se tennga un me saje de error 
    if ($('#nombreError').text() || $('#ap_paternoError').text() || $('#ap_maternoError').text() || $('#codigo_autorError').text() || $('#nacionalidadError').text()) {
        $('#guardar').prop('disabled', true);//desactiva el botn guardar mientras haya errores.
    } else {
        $('#guardar').prop('disabled', false);
    }
};


//PAARA GURDAR LOS DATOS DEL HTML EN UN DICCIONARO CON AYUDA DE JS
const guardarAutorDiccionario = () => {
    let nombre = $('#nombre').val();
    let apellidoPaterno = $('#ap_paterno').val();
    let apellidoMaterno = $('#ap_materno').val();
    let codigoAutor = $('#codigo_autor').val(); 
    let nacionalidad = $('#nacionalidad').val();

    let guardarAutor = {
        "nombre": nombre,
        "apellido_pa": apellidoPaterno,
        "apellido_ma": apellidoMaterno,
        "nacionalidad": nacionalidad,
        "codigo_autor": codigoAutor
    };
    return guardarAutor
};

//-----------------------------------APARTADO PARA MOSTRAR LOS DATOS A LA TABLA Y BOTONES DE ELIMINAR Y ACTUALIZAR-----------------------------------
$('#guardar').on('click', () => {
    let datos = guardarAutorDiccionario();
    MostrarDatosTabla();
    //PREPARACION DEL PAQUETE "ENVIO"
    $.ajax({
        url: "../Controller/AutoresController.php", //URL, DOMINIO, SERVIDOR
        method: "POST", // VA A HACER PRIVADO EL METODO DE VIAJE: POST , GET, PUT, DELETE
        data: { peticion: "Insertar_Autores", paquete: datos }, //PAQUETES DE DATOS
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
        },
        error: function (xhr, status, error) {
            console.error('Error:', status);
            Swal.fire(
                '¡Algo salió mal!',
                'Hubo un problema con la solicitud. Inténtalo de nuevo.',
                'warning'
            );
        }
    });

    $('#nombre, #ap_paterno, #ap_materno, #codigo_autor').val('');
    $('#nacionalidad').val('');
    let seleccion = $('#nacionalidad').val();
    if (seleccion == "") {
        $('#nacionalidadError').text('Selecciona una nacionalidad.');
    }
    verificarCampos();
    
});

//-------------------------------------------------BOTONES DE LAS ACCIONES DE LA TABLA "actualizar" "eliminar"------------------
const BtnEliminar = () => {
    let eliminar = '<button class="btn btn-danger">Eliminar</button>';
    return eliminar; 
}

const BtnActualizar = () => {
    return '<button class="btn btn-warning btn-actualizar" data-bs-toggle="modal" data-bs-target="#modalActualizar">Actualizar</button>';
};

//--------------------------------------FUNCION PARA CREAR UNA FILA DE LA TABLA------------------------
const FilasTablaAutores = (autor) => {
    return `
        <tr>
            <td>${autor.nombres}</td>
            <td>${autor.a_paterno}</td>
            <td>${autor.a_materno}</td>
            <td>${autor.nacionalidad}</td>
            <td>${autor.codigoAutor}</td>
            <td>${BtnActualizar()}</td>
            <td>${BtnEliminar()}</td>
        </tr>`;
};

//--------------------------------------FUNCION PARA MOSTRAR DATOS EN LA TABLA------------------------
const MostrarDatosTabla = () => {
    $('#mostrar').empty(); // Limpia las filas si es que llegan a duplicar

    $.ajax({
        url: "../Controller/AutoresController.php", 
        method: "POST", 
        data: { peticion: "All_Autores" }, 
        dataType: "json", 
        success: function (respuesta) {
            if (respuesta.estado) { 
                respuesta.datos.forEach(autor => {
                    $('#mostrar').append(FilasTablaAutores(autor));
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
};//--------------------------------------BUSCADOR ------------------------
$('#buscador').on('keyup', () => {
    let buscarTexto = $('#buscador').val().toLowerCase(); // Obtiene el valor del input y lo convierte a minusculas
    console.log("Texto buscado:", buscarTexto); 

    $('#mostrar tr').each((index, tabla) => { // Se itera cada fila que tiene la tabla con each de JQuery
        let textoTabla = $(tabla).text().toLowerCase(); // Obtiene el texto de la fila y lo convierte a minusculas
        console.log("Conforme a:", textoTabla);

        if (textoTabla.includes(buscarTexto)) { // Si el texto de la fila contiene lo que escribi
            $(tabla).show(); // Muestra la fila, show hace que el elmento sea visible
            console.log("Mostrando datos correspondientes:");
        } else {
            $(tabla).hide(); // Si no, oculta la fila, hide hace que los elementos se oculten
            console.log("Datos no correspondientes:");
        }
    });
});