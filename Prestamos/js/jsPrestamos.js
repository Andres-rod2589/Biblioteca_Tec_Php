import { mesajes } from "../../Hooks/mesajes.js"; // Ensure mesajes is imported correctly
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
    let fila = $(this).closest('tr');
    let idPrestamo = fila.data('id');
    if (!idPrestamo) {
        
    }

    let codigo = fila.find('td:nth-child(1)').text();
    let libro = fila.find('td:nth-child(2)').text();
    let usuario = fila.find('td:nth-child(3)').text();
    let fechaPrestamo = fila.find('td:nth-child(4)').text();
    let fechaDevolucion = fila.find('td:nth-child(5)').text();
    let estado = fila.find('td:nth-child(6)').text();
    let observaciones = fila.find('td:nth-child(7)').text();

    $('#mostrarLibrosActualizar').empty().append(`<option selected>${libro}</option>`).prop('disabled', true);
    $('#codigoEjemplarActualizar').empty().append(`<option selected>${codigo}</option>`).prop('disabled', true);
    $('#mostrarUsuariosActualizar').empty().append(`<option selected>${usuario}</option>`).prop('disabled', true);
    $('#fechaPrestamosActualizar').val(fechaPrestamo).prop('disabled', true);
    $('#fechaDevolucionActualizar').val(fechaDevolucion);
    $('#estadoLibroActualizar').val(estado);
    $('#ObservacionesActualizar').val(observaciones);
    $('#guardarActualizar').data('id', idPrestamo);
});

$(document).on('click', '#guardarActualizar', function () {
    let idPrestamo = $(this).data('id');
    if (!idPrestamo) {
        console.error('id_prestamo is undefined.');
        return;
    }

    let datos = {
        id_prestamo: idPrestamo,
        fechaDevolucion: $('#fechaDevolucionActualizar').val(),
        estado: $('#estadoLibroActualizar').val(),
        observaciones: $('#ObservacionesActualizar').val()
    };

    actualizarPrestamo(datos);
});

$(document).on('click', '.btn-eliminar', function () {
    let fila = $(this).closest('tr');
    let idPrestamo = fila.data('id'); // Retrieve id_prestamo from the row's data-id attribute

    console.log('id_prestamo retrieved from row:', idPrestamo); // Debugging log

    if (!idPrestamo) {
        console.error('id_prestamo is undefined.');
        return;
    }

    // Confirm deletion
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarPrestamo(idPrestamo, fila);
        }
    });
});

export const eliminarPrestamo = (idPrestamo, fila) => {
    console.log('id_prestamo being sent:', idPrestamo); // Log id_prestamo for debugging
    $.ajax({
        url: "../Controller/PrestamosController.php",
        method: "POST",
        data: { peticion: "Eliminar_Prestamos", id_prestamo: idPrestamo },
        dataType: "json",
        success: function (respuesta) {
            if (respuesta.estado) {
                Swal.fire('Eliminado', respuesta.MSG, 'success');
                fila.remove(); // Remove the row from the table
            } else {
                Swal.fire('Error', respuesta.MSG || 'No se pudo eliminar el préstamo.', 'error');
            }
        },
        error: function (xhr, status, error) {
            console.error('AJAX error:', status, error);
            Swal.fire('Error', 'Error en la solicitud. Verifica los datos enviados.', 'error');
        }
    });
};