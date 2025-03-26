<?php 
require_once '../Model/LibrosModel.php';
require_once '../../Helpers/convertidorJSON.php';

class LibrosController extends LibrosModel{
    private $peticion = null;
    public function __construct($peticion=null, $paquete=null){
        parent::__construct($paquete);
        $this->peticion = $peticion;
    }

    public function Peticiones(){
        switch($this->peticion){
            case 'All_Autores':
                return $this->MostrarAutores();
            case 'All_Libros':
                return $this->MostrarLibros();
            case 'Insertar_Libros':
                return $this->AgregarLibros();
            case 'Actualizar_Libros':
                return $this->ActualizarLibros();
            case 'Eliminar_Libros':
                return $this->EliminarLosLibros();
            default:
                return convertidorJSON(["estado" => False, "MSG" => "Peticion desconocida"]);
        }
    }

    public function MostrarAutores(){
        $mostrar = $this->ConsultarAutores();
        if($mostrar["estado"]){
            $respuesta = ["estado" => true, "MSG" => "Autores encontrados", "datos" => $mostrar["Autor"]];
        }else{
            $respuesta = ["estado" => false, "MSG" => "Autores no encontrados", "error" => $mostrar["Error capturada"]];
        }
        return convertidorJSON($respuesta);
    }

    public function MostrarLibros() {
        $mostrar = $this->ConsultarLibros();
    
        if ($mostrar["estado"]) {
            $respuesta = [
                "estado" => true,
                "MSG" => "Libros encontrados",
                "datos" => $mostrar["libros"] // Corregido: "libros" en minúsculas
            ];
        } else {
            $respuesta = [
                "estado" => false,
                "MSG" => "Libros no encontrados",
                "error" => $mostrar["error"] // Corregido: "error" en lugar de "Error capturada"
            ];
        }
    
        return convertidorJSON($respuesta);
    }
     

    public function AgregarLibros() {
        $resultado = $this->InsertarLibros();
        if ($resultado["estado"]) {
            $respuesta = ["estado" => true, "MSG" => "Libro insertado correctamente", "Insertado" => $resultado['Insertado']];
        } elseif ($resultado["Existe"]) {
            $respuesta = ["estado" => false, "MSG" => $resultado['Existe']];
        } elseif($resultado['Error capturada']) {
            $respuesta = [ "estado" => false, "MSG" => "Error al insertar el autor", "Error" => $resultado['Error capturada']];
        }else {
            $respuesta = ["estado" => false, "MSG" => "Error de otro planeta"];
        }
        return convertidorJSON($respuesta);
    }

    public function ActualizarLibros() {
        $resultado = $this->EditarLibros();
        
        if ($resultado["estado"]) {
            $respuesta = ["estado" => true, "MSG" => "Libro actualizado correctamente", "Actualizado" => $resultado['Actualizado']];
        } elseif ($resultado["estado"] ) {
            $respuesta = ["estado" => false, "MSG" => $resultado['MSG']];
        } elseif ($resultado["noEncontrado"]) {
            $respuesta = ["estado" => false, "MSG" => $resultado['noEncontrado']];
        } elseif ($resultado['Error capturada']) {
            $respuesta = ["estado" => false, "MSG" => "Error al actualizar el libro", "Error" => $resultado['Error capturada']];
        } else {
            $respuesta = ["estado" => false, "MSG" => "Error de otro planeta"];
        }
    
        return convertidorJSON($respuesta);
    }

    public function EliminarLosLibros() {
        $resultado = $this->EliminarLibrp();
        
        if ($resultado["estado"]) {
            $respuesta = ["estado" => true, "MSG" => "Libro eliminado correctamente", "Eliminado" => $resultado['Eliminado']];
        } elseif (isset($resultado["MSG"])) {
            $respuesta = ["estado" => false, "MSG" => $resultado['MSG']];
        } elseif (isset($resultado['Error'])) {
            $respuesta = ["estado" => false, "MSG" => "Error al eliminar el libro", "Error" => $resultado['Error']];
        } else {
            $respuesta = ["estado" => false, "MSG" => "Error de otro planeta"];
        }
        
        return convertidorJSON($respuesta);
    }

}

$peticion = $_POST['peticion'] ?? null;
$paquete = $_POST['paquete'] ?? null;

$objLibros = new LibrosController($peticion, $paquete);
$objLibros->Peticiones();
?>