//FUNCION FLECHA QUE CONTEGAN EL AJAX
import { mesajes} from "../../Hooks/Mensajes.js";

export const guardarUsuario = (datos) => {
    $.ajax({
        url: "../Controller/UsuarioController.php", //URL, DOMINIO, SERVIDOR
        method: "POST", 
        data: { peticion: "Insertar_Usuarios", paquete: datos }, 
        dataType: "json", 
        success: function (respuesta) {
            mesajes(respuesta,false);
            $('#guardarModal').modal('hide');

        },
        error: function (xhr, status, error) {
            console.error('Error:', status);
            mesajes(respuesta,true)
        }
    });
};