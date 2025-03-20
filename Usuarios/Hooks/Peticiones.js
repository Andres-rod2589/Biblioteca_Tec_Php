//FUNCION FLECHA QUE CONTEGAN EL AJAX
import { mesajes} from "../../Hooks/mesajes.js";
import { FilasTablaUsuarios } from "./getValues.js";

export const guardarUsuario = (datos) => {
    $.ajax({
        url: "../Controller/UsuarioController.php", //URL, DOMINIO, SERVIDOR
        method: "POST", 
        data: { peticion: "Insertar_Usuarios", paquete: datos }, 
        dataType: "json", 
        success: function (respuesta) {
            mesajes(respuesta,false);
            $('#guardarModal').modal('hide');
            MostrarDatosTabla();

        },
        error: function (xhr, status, error) {
            console.error('Error:', status);
            mesajes(respuesta,true)
        }        
    });
};

export const actualizarUsuario = (datos) => {
    $.ajax({
        url: "../Controller/UsuarioController.php", //URL, DOMINIO, SERVIDOR
        method: 'POST',
        data: { peticion: "Actualizar_Usuarios", paquete: datos},
        dataType: "json", 
        success: function (respuesta)  {
            mesajes(respuesta,false);
            $('#modalActualizar').modal('hide');
            MostrarDatosTabla();
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
            mesajes(respuesta,true)
        }
    });
};

export const MostrarDatosTabla = () => {
    $('#mostrar').empty();
    $.ajax({
        url: "../Controller/UsuarioController.php", 
        method: "POST", 
        data: { peticion: "All_Usuarios" }, 
        dataType: "json", 
        success: function (respuesta) {
            if (respuesta.estado) { 
                respuesta.datos.forEach(usuario => {
                    $('#mostrar').append(FilasTablaUsuarios(usuario));
                });
            } else {
                mesajes(respuesta,false);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error en AJAX:', status);
            mesajes(respuesta,true);
        }
    });
};