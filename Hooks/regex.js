export const validarBoton = () => {
    let hayErrores = $('#nombreError').text() || $('#ap_paternoError').text() || $('#ap_maternoError').text() || $('#n_interiorError').text() || $('#telefonoError').text() || $('#cpError').text() || $('#calleError').text();
    let camposVacios = $('#nombre').val().trim() == '' || $('#ap_paterno').val().trim() == '' || $('#ap_materno').val().trim() == '' || $('#n_exterior').val().trim() == '' ||  $('#n_interior').val().trim() == '' || $('#telefono').val().trim() =='' || $('#cp').val().trim() == '' || $('#calle').val().trim() == '';

    if (hayErrores || camposVacios) {
        $('#guardar').prop('disabled', true);
    } else {
        $('#guardar').prop('disabled', false);
    }
};
export const verificarCamposModal = () => {
    if ($('#nombreActualizarError').text() || $('#apPaternoActualizarError').text() || $('#apMaternoActualizarError').text() || $('#TelefonoActualizarError').text() || $('#calleActualizarError').text() || $('#n_exteriorActualizarError').text() || $('#n_interiorActualizarError').text() || $('#cpActualizarError').text()) {
        $('#guardarActualizar').prop('disabled', true);
    } else {
        $('#guardarActualizar').prop('disabled', false);
    }
};
export const validarInputs = (input) => {
    let inputvalores = input.value;
    const valiInformacion = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]*$/;
    const valiTelefono = /^[0-9]*$/;
    
    let MensajeError = '';
    let MensajeErrorN = '';
    if (!valiInformacion.test(inputvalores)) {
        MensajeError = 'Solo se permiten letras';
    } else if (!valiTelefono.test(inputvalores)) {
        MensajeErrorN = 'Solo números';
    }
    if (input.id == 'nombre') {
        $('#nombreError').text(MensajeError);
    } else if (input.id == 'ap_paterno') {
        $('#ap_paternoError').text(MensajeError);
    } else if (input.id == 'ap_materno') {
        $('#ap_maternoError').text(MensajeError);
    } else if (input.id == 'calle') {
        $('#calleError').text(MensajeError);
    } else if (input.id == 'telefono') {
        $('#telefonoError').text(MensajeErrorN);
    } else if (input.id == 'cp') {
        $('#cpError').text(MensajeErrorN);
    } else if (input.id == 'n_interior') {
        $('#n_interiorError').text(MensajeErrorN);
    } else if (input.id == 'n_exterior') {
        $('#n_exteriorError').text(MensajeErrorN);
    }
};

export const ValidarInputsUpdate = (input) => {
    let inputvalores = input.value;
    const valiInformacion = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]*$/;
    const valiTelefono = /^[0-9]*$/;
    
    let MensajeError = '';
    let MensajeErrorN = '';
    if (!valiInformacion.test(inputvalores)) {
        MensajeError = 'Solo se permiten letras';
    } else if (!valiTelefono.test(inputvalores)) {
        MensajeErrorN = 'Solo números';
    }
    if (input.id == 'nombreActualizar') {
        $('#nombreActualizarError').text(MensajeError);
    } else if (input.id == 'apPaternoActualizar') {
        $('#apPaternoActualizarError').text(MensajeError);
    } else if (input.id == 'apMaternoActualizar') {
        $('#apMaternoActualizarError').text(MensajeError);
    } else if (input.id == 'calleActualizar') {
        $('#calleActualizarError').text(MensajeError);
    } else if (input.id == 'telefonoActualizar') {
        $('#TelefonoActualizarError').text(MensajeErrorN);
    } else if (input.id == 'cpActualizar') {
        $('#cpActualizarError').text(MensajeErrorN);
    } else if (input.id == 'num_interiorActualizar') {
        $('#n_interiorActualizarError').text(MensajeErrorN);
    } else if (input.id == 'num_exteriorActualizar') {
        $('#n_exteriorActualizarError').text(MensajeErrorN);
    }
};