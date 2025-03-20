$(document).ready(function () {
    // Fetch available books and populate the dropdown
    $.ajax({
        url: '../Controller/ControllerPrestamos.php?action=getAvailableBooks',
        method: 'GET',
        success: function (response) {
            const books = JSON.parse(response);
            const select = $('#mostrarLibros');
            books.forEach(book => {
                select.append(`<option value="${book.id}">${book.titulo}</option>`);
            });
        },
        error: function () {
            console.error('Error fetching books.');
        }
    });
});
