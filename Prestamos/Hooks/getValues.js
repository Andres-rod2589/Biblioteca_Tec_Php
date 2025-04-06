export const getValuesLibroEjemplar = () => {
    let isbn = $('#mostrarLibros').val();
    let isbnLibro = {
        "isbn": isbn
    };
    return isbnLibro;
};

export const getValuesPrestamo = () => {
    let codigoUsuario = $('#mostrarUsuarios').val();
    let codigoEjemplar = $('#codigoEjemplar').val();
    let fechaPrestamo = $('#fechaPrestamos').val();
    let fechaDevolucion = $('#fechaDevolucion').val();
    let estado = $('#estadoLibro').val();
    let observaciones = $('#Observaciones').val();
    let prestamo = {
        "codigoUsuario": codigoUsuario,
        "codigoEjemplar": codigoEjemplar,
        "fechaPrestamo": fechaPrestamo,
        "fechaDevolucion": fechaDevolucion,
        "estado": estado,
        "observaciones": observaciones
    };
    return prestamo;
};

const BtnEliminar = () => {
    return `<button class="btn btn-danger btn-eliminar">Eliminar</button>`; // Use the btn-eliminar class
};

const BtnActualizar = () => {
    return '<button class="btn btn-warning btn-actualizar" data-bs-toggle="modal" data-bs-target="#modalActualizar">Actualizar</button>';
};

export const FilasTablaPrestamos = (prestamo) => {
    return `
        <tr data-id="${prestamo.id_prestamo}"> <!-- Ensure id_prestamo is correctly set -->
            <td>${prestamo.Codigo}</td>
            <td>${prestamo.Libro}</td>
            <td>${prestamo.Usuario}</td>
            <td>${prestamo.FechaPrestamo}</td>
            <td>${prestamo.FechaDevolucion}</td>
            <td>${prestamo.Estado}</td>
            <td>${prestamo.Observaciones}</td>
            <td>${BtnActualizar()}</td>
            <td>${BtnEliminar()}</td>
        </tr>`;
};