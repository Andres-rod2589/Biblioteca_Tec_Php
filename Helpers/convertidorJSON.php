<?php 
function convertidorJSON($respuesta){
    header("http/1.1.200");
    header("content-Type: application/json");
    echo json_encode($respuesta);
    exit;
};
?>