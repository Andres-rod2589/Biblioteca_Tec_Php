export const validarnombres = (input) => {
    let inputValor = input.value;
    const validacionLetras = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]*$/;
    let MensajeError = '';

    if (!inputValor) {
        MensajeError = 'Este campo es obligatorio.';
    } else if (!validacionLetras.test(inputValor)) {
        MensajeError = 'Solo se permiten letras.';
    }
    if (input.id == 'nombre') {
        $('#nombreError').text(MensajeError);
    } else if (input.id == 'ap_paterno') {
        $('#ap_paternoError').text(MensajeError);
    } else if (input.id == 'ap_materno') {
        $('#ap_maternoError').text(MensajeError);
    } else if (input.id == 'calle') {
        $('#calleError').text(MensajeError);
    }
}
export const validartelefono = (input) => {
    let inputValor = input.value;
    const validacionNumeros = /^[0-9]*$/;
    let MensajeError = '';
    if (!inputValor) {
        MensajeError = 'Este campo es obligatorio.';
    } else if (!validacionNumeros.test(inputValor)) {
        MensajeError = 'Solo se permiten números.';
    } else if (inputValor.length !== 10) {
        MensajeError = 'Debe contener 10 dígitos.';
    }
    $('#telefonoError').text(MensajeError);
};
export const validarcodigo = (input) => {
    let inputValor = input.value;
    const validacionNum = /^[0-9]*$/;
    let MensajeError = '';
    if (!inputValor) {
        MensajeError = 'Este campo es obligatorio.';
    } else if (!validacionNum.test(inputValor)) {
        MensajeError = 'Solo se permiten números.';
    } else if (inputValor.length !== 5) {
        MensajeError = 'Debe contener 5 dígitos.';
    }
    $('#cpError').text(MensajeError);
};

export const validarNumExtInt = (input) => {
    let inputValor = input.value;
    const validacionLetras = /^[0-9]*$/;
    let MensajeError = '';

    if (!inputValor) {
        MensajeError = 'Este campo es obligatorio.';
    } else if (!validacionLetras.test(inputValor)) {
        MensajeError = 'Solo se permiten numeros.';
    }
    if (input.id == 'n_exterior') {
        $('#n_exteriorError').text(MensajeError);
    } else if (input.id == 'n_interior') {
        $('#n_interiorError').text(MensajeError);
    } 
}

export const verificarCampos = () => {
    // Verifica que no se tenga un mensaje de error
    let hayErrores = $('#nombreError').text() ||
                    $('#ap_paternoError').text() ||
                    $('#ap_maternoError').text() ||
                    $('#telefonoError').text() ||
                    $('#calleError').text() ||
                    $('#n_exteriorError').text() ||
                    $('#n_interiorError').text() ||
                    $('#cpError').text();

    $('#guardar').prop('disabled', hayErrores); // Desactiva el botón guardar mientras haya errores.
};