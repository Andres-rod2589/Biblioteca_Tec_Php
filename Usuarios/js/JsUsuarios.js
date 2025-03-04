import { validarcodigo, validarnombres, validartelefono, verificarCampos, validarNumExtInt } from "../../regex/regex.js";
import { getValues } from "../Hooks/getValues.js";  // Importamos la función getValues del archivo getValues.js
import { guardarUsuario } from "../Hooks/Peticiones.js";  // Importamos la función guardarUsuario del archivo Peticiones.js
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

});


//PAARA GURDAR LOS DATOS DEL HTML EN UN DICCIONARO CON AYUDA DE JS
$('#guardar').on('click', () => {
    let datos = getValues();
    console.log(datos);
    // $.ajax({
        guardarUsuario(datos);
    
});



