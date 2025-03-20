 export const getValues = () =>{
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
}

export const getValuesUpdate = () =>{
    let nombre = $('#nombreActualizar').val();
    let apellidoPaterno = $('#apPaternoActualizar').val();
    let apellidoMaterno = $('#apMaternoActualizar').val();
    let numExt = $('#num_exteriorActualizar').val();
    let numInt = $('#num_interiorActualizar').val();
    let telefono = $('#telefonoActualizar').val();
    let cp = $('#cpActualizar').val();
    let calle = $('#calleActualizar').val();
    let codigoUsuario = $('#codigoUsuario').val();

    let actualizarUsuario = {
        "nombre": nombre,
        "apellido_pa": apellidoPaterno,
        "apellido_ma": apellidoMaterno,
        "numero_exterior": numExt,
        "numero_interior": numInt,
        "telefono": telefono,
        "codigo_postal": cp,
        "calle": calle,
        "codigoUsuario": codigoUsuario
    };
    return actualizarUsuario
};

export const llenarInputsUpdate = (event) =>{
    const btn = event.currentTarget;
    let fila = $(btn).closest('tr');

    let nombre = fila.find('td:nth-child(1)').text();
    let apellidoPaterno = fila.find('td:nth-child(2)').text();
    let apellidoMaterno = fila.find('td:nth-child(3)').text();
    let telefono = fila.find('td:nth-child(4)').text();
    let calle = fila.find('td:nth-child(5)').text();
    let numero_exterior = fila.find('td:nth-child(6)').text();
    let numero_interior = fila.find('td:nth-child(7)').text();
    let codigo_postal = fila.find('td:nth-child(8)').text();
    let codigoUsuario = fila.find('td:nth-child(9)').text();

    $('#nombreActualizar').val(nombre);
    $('#apPaternoActualizar').val(apellidoPaterno);
    $('#apMaternoActualizar').val(apellidoMaterno);
    $('#telefonoActualizar').val(telefono);
    $('#calleActualizar').val(calle);
    $('#num_exteriorActualizar').val(numero_exterior);
    $('#num_interiorActualizar').val(numero_interior);
    $('#cpActualizar').val(codigo_postal);
    $('#codigoUsuario').val(codigoUsuario);
};

const BtnEliminar = () => {
    return `<button class="btn btn-danger" onclick="eliminarUsuario()">Eliminar</button>`;
};

const BtnActualizar = () => {
    return '<button class="btn btn-warning btn-actualizar" data-bs-toggle="modal" data-bs-target="#modalActualizar">Actualizar</button>';
};

export const FilasTablaUsuarios = (usuario) => {
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
            <td>${usuario.CodigoUsuario}</td>
            <td>${BtnActualizar()}</td>
            <td>${BtnEliminar()}</td>
        </tr>`;
};