import { mesajes } from "../../Hooks/mesajes.js";
import { mostrarCodigoEjemplar, mostrarLibroosSelect, mostrarUsuariosEjemplar, guardarPrestamo, MostrarDatosTabla } from "../Hooks/peticiones.js";
import { getValuesLibroEjemplar, getValuesPrestamo } from "../Hooks/getValues.js";

$(document).ready(() => {
    MostrarDatosTabla();
    mostrarLibroosSelect();
    mostrarCodigoEjemplar();
    mostrarUsuariosEjemplar();
    

    $('#guardar').on('click', () => {
        let datos = getValuesPrestamo();
        guardarPrestamo(datos);
        MostrarDatosTabla();
        $('#mostrarLibros, #codigoEjemplar, #mostrarUsuarios, #estadoLibro, #fechaPrestamos,#fechaDevolucion, #Observaciones').val('');
    });
});

$(document).on('change', '#mostrarLibros',() => {
    let datos = getValuesLibroEjemplar();
    mostrarCodigoEjemplar(datos);
});