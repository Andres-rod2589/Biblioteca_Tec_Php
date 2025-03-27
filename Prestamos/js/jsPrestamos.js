import { mesajes } from "../../Hooks/mesajes.js";
import { mostrarCodigoEjemplar, mostrarLibroosSelect, mostrarUsuariosEjemplar, guardarPrestamo, MostrarDatosTabla } from "../Hooks/peticiones.js";
import { getValuesLibroEjemplar, getValuesPrestamo } from "../Hooks/getValues.js";

$(document).ready(() => {
    MostrarDatosTabla();
    mostrarLibroosSelect();
    mostrarUsuariosEjemplar();

    $('#guardar').on('click', () => {
        let datos = getValuesPrestamo();
        guardarPrestamo(datos);
        MostrarDatosTabla();
        $('#mostrarLibros, #codigoEjemplar, #mostrarUsuarios, #estadoLibro, #fechaPrestamos,#fechaDevolucion, #Observaciones').val('');
    });
});

$(document).on('change', '#mostrarLibros', () => {
    let datos = getValuesLibroEjemplar();
    mostrarCodigoEjemplar(datos);
});

$(document).on('click', '.btn-actualizar', function () {
    let btn = $(this);
    let fila = btn.closest('tr');

    let codigo = fila.find('td:nth-child(1)').text();
    let libro = fila.find('td:nth-child(2)').text();
    let usuario = fila.find('td:nth-child(3)').text();
    let fechaPrestamo = fila.find('td:nth-child(4)').text();
    let fechaDevolucion = fila.find('td:nth-child(5)').text();
    let estado = fila.find('td:nth-child(6)').text();
    let observaciones = fila.find('td:nth-child(7)').text();

    // Populate and disable fields that should not be updated
    $('#mostrarLibrosActualizar').empty().append(`<option selected>${libro}</option>`).prop('disabled', true);
    $('#codigoEjemplarActualizar').empty().append(`<option selected>${codigo}</option>`).prop('disabled', true);
    $('#mostrarUsuariosActualizar').empty().append(`<option selected>${usuario}</option>`).prop('disabled', true);
    $('#fechaPrestamosActualizar').val(fechaPrestamo).prop('disabled', true);

    // Populate editable fields
    $('#fechaDevolucionActualizar').val(fechaDevolucion);
    $('#estadoLibroActualizar').val(estado);
    $('#ObservacionesActualizar').val(observaciones);
});

$(document).on('click', '#guardarActualizar', function () {
    console.log('guardarActualizar button clicked'); // Debugging log

    let datos = {
        codigoUsuario: $('#mostrarUsuariosActualizar').val(),
        fechaDevolucion: $('#fechaDevolucionActualizar').val(),
        estado: $('#estadoLibroActualizar').val(),
        observaciones: $('#ObservacionesActualizar').val()
    };

    console.log('Data to send:', datos); // Debugging log

    actualizarPrestamo(datos);
});

export const actualizarPrestamo = (datos) => {
    console.log('Sending AJAX request with data:', datos); // Debugging log

    $.ajax({
        url: "../Controller/PrestamosController.php",
        method: "POST",
        data: { peticion: "Actualizar_Prestamos", paquete: datos },
        dataType: "json",
        success: function (respuesta) {
            console.log('Response received:', respuesta); // Debugging log

            if (respuesta.estado) {
                mesajes(respuesta, false);
                $('#modalActualizar').modal('hide');
                MostrarDatosTabla();
            } else {
                console.error('Error in response:', respuesta.MSG || 'Unknown error');
                mesajes({ estado: false, MSG: respuesta.MSG || 'Error desconocido' }, true);
            }
        },
        error: function (xhr, status, error) {
            console.error('AJAX error:', status, error); // Debugging log
            console.error('Response text:', xhr.responseText); // Debugging log
            mesajes({ estado: false, MSG: 'Error en la solicitud. Verifica los datos enviados.' }, true);
        }
    });
};