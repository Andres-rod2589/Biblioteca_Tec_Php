import { mesajes } from "../../Hooks/mesajes.js";
import { validarBoton, validarInputs, ValidarInputsUpdate, verificarCamposModal} from "../../Hooks/regex.js";
import { getValues, getValuesUpdate, llenarInputsUpdate} from "../Hooks/getValues.js";
import { guardarUsuario, actualizarUsuario, MostrarDatosTabla} from "../Hooks/peticiones.js";
//AQUI TODAS LAS FUNCIONES QUE TIENEN EVENTOS

$(document).ready(() =>{
    MostrarDatosTabla();
    $('#guardar').on('click', () => {
        let datos = getValues();
        guardarUsuario(datos);
        MostrarDatosTabla();
        $('#nombre, #ap_paterno, #ap_materno, #calle, #telefono,#cp, #n_exterior, #n_interior').val('');
        validarBoton();
    });
    $('.eventos').on('keyup', function () {
        validarInputs(this);
        validarBoton();
        ValidarInputsUpdate(this);
        verificarCamposModal();
    })
});
$(document).on('click', '.btn-actualizar', (event) => {
    llenarInputsUpdate(event);
});
$('#guardarActualizar').on('click', function () {
    let datos = getValuesUpdate();
    actualizarUsuario(datos);
    MostrarDatosTabla();
    $('#nombre, #ap_paterno, #ap_materno, #calle, #telefono,#cp, #n_exterior, #n_interior').val('');
})