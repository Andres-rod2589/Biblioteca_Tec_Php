$(document).on('click', '.btn-actualizar', function () {
    let btn = $(this);
    let fila = btn.closest('tr');

    let titulo = fila.find('td:nth-child(1)').text();
    let isbn = fila.find('td:nth-child(2)').text();
    let categoria = fila.find('td:nth-child(3)').text();
    let autorNombre = fila.find('td:nth-child(4)').text();
    let ejemplares = fila.find('td:nth-child(5)').text();
    let codigo_autor = btn.attr("data-codigoAutor");

    // LLENANDO LOS INPUTS DEL MODAL
    $('#tituloActualizar').val(titulo);
    $('#codigoLibroActualizar').val(isbn);
    $('#categoriasActualizar').val(categoria);
    $('#mostrarAutoresActualizar').val(codigo_autor);
    $('#mostrarejemplares').val(ejemplares);

    $('#codigoLibro').val(isbn);
});

$(document).ready(()=>{
    //VERIFICAR TODOS LOS CAMPOS PARA QUE NO TENGAN LOS TEXTOS DE ERROR
    const verificarCamposModal = () =>{
    //Se verifica que no se tennga un me saje de error 
        if ($('#tituloActualizarError').text() || $('#codigoLibroActualizarError').text() || $('#mostrarAutoresActualizarError').text() || $('#categoriasActualizarError').text()) {
            $('#guardarActualizar').prop('disabled', true);//desactiva el botn guardar mientras haya errores.
        } else {
            $('#guardarActualizar').prop('disabled', false);
        }
    };

    $('#tituloActualizar').on('keyup', () => {
        let inputTitulo = $('#tituloActualizar').val();
        const validacionLetras = /^[a-zA-ZáéíóúÁÉÍÓÚ\s0-9¡!¿?,]*$/;
    
        if (inputTitulo.trim() == "") { //EL CAMPO NO DEBE ESTAR VACIO
            $('#tituloActualizarError').text('Campo obligatorrio');
        } else if (validacionLetras.test(inputTitulo)) {
            $('#tituloActualizarError').text('');
        } else {
            $('#tituloActualizarError').text('Caracter no autorizado');
        }
        verificarCamposModal();
    });
    
    $('#codigoLibroActualizar').on('keyup', () => {
        let inputValor = $('#codigoLibroActualizar').val();
        const validacionCodigo = /^[0-9]*$/;
    
        if (inputValor.trim() == "") {
            $('#codigoLibroActualizarError').text('Campo obligatorio');
        } else if (!validacionCodigo.test(inputValor)) {
            $('#codigoLibroActualizarError').text('Solo numeros');
        } else if (inputValor.length < 10) {
            $('#codigoLibroActualizarError').text('Minimo 10 caracteres');
        } else if (inputValor.length > 13) {
            $('#codigoLibroActualizarError').text('No puede tenr mas 13 caracteres');
        } else {
            $('#codigoLibroActualizarError').text('');
        }
        verificarCamposModal();
    });
    verificarCamposModal();
})

const actualizarLibrosDiccionario = () =>{
    let titulo = $('#tituloActualizar').val();
    let isbn = $('#codigoLibro').val();
    let categoria = $('#categoriasActualizar').val();
    let autores = $('#mostrarAutoresActualizar').val();
    let codigoAutorNuevo = $('#codigoLibroActualizar').val(); 
    let ejemplares = $('#mostrarejemplares').val();


    let actualizarLibros ={
        "titulo":titulo,
        "isbn":isbn,
        "categoria":categoria,
        "autor":autores,
        "isbn_nuevo": codigoAutorNuevo,
        "ejemplares": ejemplares
    };
    return actualizarLibros;
}

$('#guardarActualizar').on('click', function () {
    let datos = actualizarLibrosDiccionario();
    MostrarDatosTabla();
    $.ajax({
        url: "../Controller/LibrosController.php", //URL, DOMINIO, SERVIDOR
        method: 'POST',
        data: { peticion: "Actualizar_Libros", paquete: datos},
        dataType: "json", 
        success: (respuesta) => {
            Swal.fire(
                respuesta.estado ? '¡Éxito!' : '¡Error!',
                respuesta.MSG,
                respuesta.estado ? 'success' : 'error'
            );
            if (respuesta.estado) {
                $('#modalActualizar').modal('hide'); 
                MostrarDatosTabla();
                $('#codigoLibro').val('');
            }
        },
        error: function(xhr, status, error) {
            console.log("Error: " + error);
            console.log("Status: " + status);
            console.log(xhr.responseText);
        }
        
    });
});

