<?php 
require_once '../Model/PrestamosModel.php';
require_once '../../Helpers/convertidorJSON.php';

class PrestamosController extends PestamosModel {
    private $peticion = null;
    private $id_prestamo = null;

    public function __construct($peticion = null, $paquete = null) {
        parent::__construct($paquete);
        $this->peticion = $peticion;
    }

    public function Peticiones() {
        switch ($this->peticion) {
            case 'All_Libros':
                return $this->MostrarLibros();
            case 'All_CodigoEjemplares':
                return $this->MostrarCodigoEjemplares();
            case 'All_UsuariosEjemplares':
                return $this->UsuariosEjemplares();
            case 'Insertar_Prestamos':
                return $this->InsertarPrestamos();
            case 'All_Prestamos':
                return $this->MostrarPrestamos();
            case 'Actualizar_Prestamos':
                return $this->ActualizarPrestamos();
            case 'Eliminar_Prestamos':
                return $this->EliminarPrestamos();
            default:
                return convertidorJSON(["estado" => false, "MSG" => "Peticion desconocida"]);
        }
    }

    public function MostrarLibros(){
        $mostrar = $this->ConsultarLibros();
        if($mostrar["estado"]){
            $respuesta = ["estado" => true, "MSG" => "Libros encontrados", "Libros" => $mostrar["Libros"]];
        }else{
            $respuesta = ["estado" => false, "MSG" => "Libros no encontrados", "error" => $mostrar["Error capturada"]];
        }
        return convertidorJSON($respuesta);
    }

    public function MostrarCodigoEjemplares(){
        $mostrar = $this->ConsultarCodigoEjemplares();
        if($mostrar["estado"]){
            $respuesta = ["estado" => true, "MSG" => "Ejemplares encontrados", "CodigoEjemplares" => $mostrar["CodigoEjemplares"]];
        }else{
            $respuesta = ["estado" => false, "MSG" => "Ejemplares no encontrados", "error" => $mostrar["Error capturada"]];
        }
        return convertidorJSON($respuesta);
    }

    public function UsuariosEjemplares(){
        
        $mostrar = $this->MostrarUsuariosEjemplares();
        if($mostrar["estado"]){
    
        $respuesta = ["estado" => true, "MSG" => "Ejemplares encontrados", "UsuarioEjemplares" => $mostrar["UsuarioEjemplares"]];
        }
        else{
            $respuesta = ["estado" => false, "MSG" => "Ejemplares no encontrados", "error" => $mostrar["Error capturada"]];
        }
        return convertidorJSON($respuesta);
    }

    public function InsertarPrestamos() {
        $mostrar = $this->InsertarPrestamo();
    
        if ($mostrar['estado']) {
            $respuesta = ["estado" => true, "MSG" => "Prestamo agregado exitosamente"];
        } else if (isset($mostrar['Error'])) {
            $respuesta = ["estado" => false, "MSG" => $mostrar['Error']];
        } else if (isset($mostrar['Error capturada'])) {
            $respuesta = ["estado" => false, "MSG" => "Error en la base de datos", "error" => $mostrar['Error capturada']];
        } else {
            $respuesta = ["estado" => false, "MSG" => "Ocurrio un error inesperado"];
        }
    
        return convertidorJSON($respuesta);
    }

    public function MostrarPrestamos(){
        $mostrar = $this->ConsultarPrestamos();
        if($mostrar["estado"]){
            $respuesta = ["estado" => true, "MSG" => "Préstamos encontrados", "datos" => $mostrar["Prestamos"]];
        }else{
            $respuesta = ["estado" => false, "MSG" => "Préstamos no encontrados", "error" => $mostrar["Error capturada"]];
        }
        return convertidorJSON($respuesta);
    }

    public function ActualizarPrestamos() {
        $this->id_prestamo = $this->paquete['id_prestamo'] ?? null;
        if (!$this->id_prestamo) {
            header('Content-Type: application/json');
            echo json_encode(["estado" => false, "MSG" => "El id_prestamo es requerido."]);
            return;
        }

        $mostrar = $this->EditarPrestamo();
        $respuesta = $mostrar['estado'] 
            ? ["estado" => true, "MSG" => "Prestamo actualizado exitosamente"] 
            : ["estado" => false, "MSG" => $mostrar['Error'] ?? "Error desconocido"];
        header('Content-Type: application/json');
        echo json_encode($respuesta);
    }

    public function EliminarPrestamos() {
        try {
            $id_prestamo = $_POST['id_prestamo'] ?? null;

            if (!$id_prestamo) {
                return convertidorJSON(["estado" => false, "MSG" => "El id_prestamo es requerido."]);
            }

            error_log("Attempting to delete prestamo with id: " . $id_prestamo); // Debugging log

            $resultado = $this->EliminarPrestamo($id_prestamo);

            if ($resultado['estado']) {
                return convertidorJSON(["estado" => true, "MSG" => "Préstamo eliminado exitosamente."]);
            } else {
                return convertidorJSON(["estado" => false, "MSG" => $resultado['Error'] ?? "Error desconocido."]);
            }
        } catch (Exception $e) {
            error_log("Error en EliminarPrestamos: " . $e->getMessage());
            return convertidorJSON(["estado" => false, "MSG" => "Error en el servidor."]);
        }
    }
}

$peticion = $_POST['peticion'] ?? null;
$paquete = $_POST['paquete'] ?? null;

$objAutores = new PrestamosController($peticion, $paquete);
$objAutores->Peticiones();