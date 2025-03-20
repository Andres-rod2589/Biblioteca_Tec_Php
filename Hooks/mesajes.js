export const mesajes = (respuesta, error) =>{
    Swal.fire({
        title: error ? '¡Algo salio mal!' : respuesta.estado ? '¡Éxito!' : '¡Error!',
        text: error ? 'Hubo un problema con la solicitud. Intentalo de nuevo.': respuesta.MSG,
        icon: error ? 'warning': respuesta.estado ? 'success' : 'error'
    });
};