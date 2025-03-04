export const guardarUsuario = (datos) => {
    $.ajax({
        url: "../Controller/UsuariosController.php", //URL, DOMINIO, SERVIDOR
        method: "POST", 
        data: { peticion: "Insertar_Usuarios", paquete: datos }, 
        dataType: "json", 
        success: function (respuesta) {
            Swal.fire(
                respuesta.estado ? '¡Éxito!' : '¡Error!',
                respuesta.MSG,
                respuesta.estado ? 'success' : 'error'
            ).then(() => {
                $('#guardarModal').modal('hide');
            });

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
}
