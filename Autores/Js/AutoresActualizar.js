//--------------------------------------APARTADO PRA PODER ABRIR EL MODAL Y CAPTURAR LOS DATOS CORRESPONDIETES EN LOS INPUT -------------------------------
$(document).on('click', '.btn-actualizar', (event) => {
    const btn = event.currentTarget; //se refiere al elemento HTML que se hizo clic para disparar el evento en este caso sabemos que vamos a dispara un evento click por la clase del boton de actualizar.
    let fila = $(btn).closest('tr');

    //fila.find('td:nth-child(1)') selecciona el <td> con el contenido. .text() obtiene el texto. El valor almacenado en texto sera dependiedo de la fila en la tabla por eso el (1), (2), etc.
    let nombre = fila.find('td:nth-child(1)').text();
    let apellidoPaterno = fila.find('td:nth-child(2)').text();
    let apellidoMaterno = fila.find('td:nth-child(3)').text();
    let nacionalidad = fila.find('td:nth-child(4)').text();
    let codigoAutor = fila.find('td:nth-child(5)').text();

    // Rellena los inputs del modal con los datos obtenidos
    $('#nombreActualizar').val(nombre);
    $('#apPaternoActualizar').val(apellidoPaterno);
    $('#apMaternoActualizar').val(apellidoMaterno);
    $('#codigoActualizar').val(codigoAutor);
    $('#nacionalidadActualizar').val(nacionalidad);

    $('#codigo_autor').val(codigoAutor);

    // Para abrir el modal
    const modal = new bootstrap.Modal(document.getElementById('modalActualizar'));
    modal.show();
});

$('#modalActualizar').on('shown.bs.modal', function () {
    // Usamos .attr() para asignar de manera más directa los atributos aria-hidden, aria-modal y role
    $('#modalActualizar').attr('aria-hidden', 'false')  // Asegura que el modal es visible
                    .attr('aria-modal', 'true')      // Indica que es un modal
                    .attr('role', 'dialog');
});

// Al cerrar el modal restablecemos los atributos y eliminamos el fondo del modal
$('#modalActualizar').on('hidden.bs.modal', function () {
    $('#codigo_autor').val('');
    $('.modal-backdrop').remove(); // Elimina manualmente el fondo opaco
    $('body').removeClass('modal-open').css('overflow', 'auto'); // Restaura el scroll
});




//---------------------------------------------APARTADO PARA VALIDAR QUE LOS CAMPOS SEAN CORRECTOS-------------------------------------------------------------
$(document).ready(() => {
    const verificarCamposModal = () => {
        if ($('#nombreActualizarError').text() || $('#apPaternoActualizarError').text() || $('#apMaternoActualizarError').text() || $('#codigoActualizarError').text()) {
            $('#guardarActualizar').prop('disabled', true);
        } else {
            $('#guardarActualizar').prop('disabled', false);
        }
    };

    $('#nombreActualizar, #apPaternoActualizar, #apMaternoActualizar').on('keyup', function () {
        let inputValor = $(this).val();
        const validacionLetras = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]*$/;
        let MensajeError = '';

        if (!validacionLetras.test(inputValor)) {
            MensajeError = 'Solo se permiten letras';
        }
        
        if (this.id == 'nombreActualizar') {
            $('#nombreActualizarError').text(MensajeError);
        } else if (this.id == 'apPaternoActualizar') {
            $('#apPaternoActualizarError').text(MensajeError);
        } else if (this.id == 'apMaternoActualizar') {
            $('#apMaternoActualizarError').text(MensajeError);
        }
        verificarCamposModal();
    });

    $('#codigoActualizar').on('keyup', () => {
        let inputValor = $('#codigoActualizar').val();
        const validacionCodigo = /^[A-Z0-9]*$/;

        if (validacionCodigo.test(inputValor)) {
            $('#codigoActualizarError').text('');
        }else{
            $('#codigoActualizarError').text('Solo letras mayusculas y numeros');
        }
        verificarCamposModal();
    });

    $('#modalActualizar').on('shown.bs.modal', function () {
        verificarCamposModal();
    });
});

const actualizarAutorDiccionario = () => {
    let nombre = $('#nombreActualizar').val();
    let apellidoPaterno = $('#apPaternoActualizar').val();
    let apellidoMaterno = $('#apMaternoActualizar').val();
    let codigoAutor = $('#codigo_autor').val(); 
    let nacionalidad = $('#nacionalidadActualizar').val();
    let codigoAutorNuevo = $('#codigoActualizar').val(); 

    let actualizarAutor = {
        "nombre": nombre,
        "apellido_pa": apellidoPaterno,
        "apellido_ma": apellidoMaterno,
        "nacionalidad": nacionalidad,
        "codigo_autor": codigoAutor,
        "codigo_autor_nuevo": codigoAutorNuevo
    };

    return actualizarAutor;
};


$('#guardarActualizar').on('click', function () {
    let datos = actualizarAutorDiccionario();
    console.log(datos)
    MostrarDatosTabla();

    $.ajax({
        url: "../Controller/AutoresController.php", //URL, DOMINIO, SERVIDOR
        method: 'POST',
        data: { peticion: "Actualizar_Autores", paquete: datos},
        dataType: "json", 
        success: (respuesta) => {
            Swal.fire(
                respuesta.estado ? '¡Éxito!' : '¡Error!',
                respuesta.MSG,
                respuesta.estado ? 'success' : 'error'
            );
            if (respuesta.estado) {
                $('#modalActualizar').modal('hide'); 
                $('#codigo_autor').val('');
                MostrarDatosTabla();
            }
        },
        error: function(xhr, status, error) {
            console.log("Error: " + error);
            console.log("Status: " + status);
            console.log(xhr.responseText);
        }
        
    });
});
