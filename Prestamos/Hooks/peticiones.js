import { mesajes } from "../../Hooks/mesajes.js";
import { FilasTablaPrestamos } from "./getValues.js";

export const mostrarLibroosSelect = () => {
    $.ajax({
        url: "../Controller/PrestamosController.php",
        method: "POST",
        data: { peticion: "All_Libros" },
        dataType: "json",
        success: function (respuesta) {
            if (respuesta.estado) {
                respuesta.Libros.forEach(libros => {
                    $('#mostrarLibros').append(`<option value="${libros.isbn}">${libros.nombre}</option>`);
                });
            }
        },
        error: function (xhr, status) {
            console.error('Error en AJAX:', status);
        }
    });
};

export const mostrarCodigoEjemplar = (datos) => {
    $.ajax({
        url: "../Controller/PrestamosController.php",
        method: "POST",
        data: { peticion: "All_CodigoEjemplares", paquete: datos },
        dataType: "json",
        success: function (respuesta) {
            let select = $('#codigoEjemplar');
            select.empty();
            select.append(`<option selected value="">Selecciona el ejemplar</option>`);
            if (respuesta.estado) {
                respuesta.CodigoEjemplares.forEach(ejemplar => {
                    select.append(`<option value="${ejemplar.codigo}">${ejemplar.ejemplares}</option>`);
                });
            }
        },
        error: function (xhr, status) {
            console.error('Error en AJAX:', status);
        }
    });
};

export const mostrarUsuariosEjemplar = () => {
    $.ajax({
        url: "../Controller/PrestamosController.php",
        method: "POST",
        data: { peticion: "All_UsuariosEjemplares" },
        dataType: "json",
        success: function (respuesta) {
            let select = $('#mostrarUsuarios, #mostrarUsuariosActualizar');
            select.empty();
            select.append(`<option selected value="">Selecciona al Usuario</option>`);
            if (respuesta.estado) {
                respuesta.UsuarioEjemplares.forEach(usuario => {
                    select.append(`<option value="${usuario.codigoUsuario}">${usuario.nombre_completo}</option>`);
                });
            }
        },
        error: function (xhr, status) {
            console.error('Error en AJAX:', status);
        }
    });
};

export const guardarPrestamo = (datos) => {
    $.ajax({
        url: "../Controller/PrestamosController.php",
        method: "POST",
        data: { peticion: "Insertar_Prestamos", paquete: datos },
        dataType: "json",
        success: function (respuesta) {
            mesajes(respuesta, false);
            $('#guardarPrestamos').modal('hide');
            $('#mostrarLibros, #codigoEjemplar, #mostrarUsuarios, #estadoLibro, #fechaPrestamos,#fechaDevolucion, #Observaciones').val('');
            MostrarDatosTabla();
        },
        error: function (xhr, status) {
            console.error('Error:', status);
        }
    });
};

export const MostrarDatosTabla = () => {
    $('#mostrar').empty();
    $.ajax({
        url: "../Controller/PrestamosController.php",
        method: "POST",
        data: { peticion: "All_Prestamos" },
        dataType: "json",
        success: function (respuesta) {
            if (respuesta.estado) {
                respuesta.datos.forEach(prestamo => {
                    $('#mostrar').append(FilasTablaPrestamos(prestamo));
                });
            } else {
                mesajes(respuesta, false);
            }
        },
        error: function (xhr, status) {
            console.error('Error en AJAX:', status);
        }
    });
};

export const actualizarPrestamo = (datos) => {
    $.ajax({
        url: "../Controller/PrestamosController.php",
        method: "POST",
        data: { peticion: "Actualizar_Prestamos", paquete: datos },
        dataType: "json",
        success: function (respuesta) {
            if (respuesta.estado) {
                mesajes(respuesta, false);
                $('#modalActualizar').modal('hide');
                MostrarDatosTabla();
            } else {
                console.error('Error in response:', respuesta.MSG || 'Unknown error');
                mesajes({ estado: false, MSG: respuesta.MSG || 'Error desconocido' }, true);
            }
        },
        error: function (xhr, status) {
            console.error('AJAX error:', status);
        }
    });
};