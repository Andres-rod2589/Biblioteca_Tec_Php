import { validarcodigo, validarnombres, validartelefono, verificarCampos, validarNumExtInt } from "../../Hooks/regex.js";
import { getValues } from "../Hooks/getValues.js";
import { guardarUsuario } from "../Hooks/Peticiones.js";

$(document).ready(() => {
    // Validaciones para Nombre, Apellido Paterno y Apellido Materno
    $('#nombre, #ap_paterno, #ap_materno, #calle').on('keyup', function() {
        validarnombres(this);
        verificarCampos();
    });

    // Validación para Teléfono
    $('#telefono').on('keyup', function() {
        validartelefono(this);
        verificarCampos();
    });
     // Validación para Código Postal
    $('#cp').on('keyup', function() {
        validarcodigo(this);
        verificarCampos();
    });
    // Validación para Número Exterior (Obligatorio)
    $('#n_exterior, #n_interior').on('keyup', function() {
        validarNumExtInt(this);
        verificarCampos();
    });

    // Mostrar datos en la tabla
    MostrarDatosTabla();
});


const BtnActualizar = () => {
    return '<button class="btn btn-warning btn-actualizar" data-bs-toggle="modal" data-bs-target="#modalActualizar">Actualizar</button>';
};
const BtnEliminar = () => {
    return '<button class="btn btn-danger" onclick="eliminarUsuario()">Eliminar</button>';
};


// Crea una fila de tabla para cada usuario
const FilasTablaUsuarios = (usuario) => {
    return `
        <tr>
            <td>${usuario.nombre}</td>
            <td>${usuario.ap_paterno}</td>
            <td>${usuario.ap_materno}</td>
            <td>${usuario.telefono}</td>
            <td>${usuario.calle}</td>
            <td>${usuario.n_exterior}</td>
            <td>${usuario.n_interior}</td>
            <td>${usuario.cp}</td>
            <td>${BtnActualizar()}</td>
            <td>${BtnEliminar()}</td>
            
        </tr>`;
};

// Función para mostrar los datos de los usuarios en la tabla
const MostrarDatosTabla = () => {
    $('#mostrarUsuarios').empty();

    $.ajax({
        url: "../Controller/UsuariosController.php",
        method: "POST",
        data: { peticion: "All_Usuarios" },
        dataType: "json",
        success: function (respuesta) {
            if (respuesta.estado) {
                respuesta.datos.forEach(usuario => {
                    $('#mostrarUsuarios').append(FilasTablaUsuarios(usuario));
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

// Guardar los datos del HTML en un diccionario con ayuda de JS
$('#guardar').on('click', () => {
    let datos = getValues();
    console.log(datos);
    guardarUsuario(datos);
});



