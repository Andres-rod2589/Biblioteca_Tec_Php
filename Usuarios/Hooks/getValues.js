export const getValues = () => {
        let nombre = $('#nombre').val();
        let apellidoPaterno = $('#ap_paterno').val();
        let apellidoMaterno = $('#ap_materno').val();
        let numExt = $('#n_exterior').val();
        let numInt = $('#n_interior').val();
        let telefono = $('#telefono').val();
        let cp = $('#cp').val();
        let calle = $('#calle').val();
    
        let guardarUsuario = {
            "nombre": nombre,
            "apellido_pa": apellidoPaterno,
            "apellido_ma": apellidoMaterno,
            "numero_exterior": numExt,
            "numero_interior": numInt,
            "telefono": telefono,
            "codigo_postal": cp,
            "calle": calle
        };
        return guardarUsuario
    };