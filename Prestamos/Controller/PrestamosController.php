<?php 
require_once '../Model/PrestamosModel.php';
require_once '../../Helpers/convertidorJSON.php';

class PrestamosController extends PestamosModel{
    private $peticion = null;
    public function __construct($peticion= null, $paquete=null){
        parent::__construct($paquete);
        $this->peticion = $peticion;
    }
                    
    //HACER UN SWITCH 
    //EL PIMER CASO QUE SE LLAME GET AUTORES (CONSULTARUsuarios) e invocar
    public function Peticiones(){
        switch($this->peticion) {
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
            default:
                return convertidorJSON(["estado" => False, "MSG" => "Peticion desconocida"]);
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
            $respuesta = ["estado" => true, "MSG" => "Prestamoos encontrados", "datos" => $mostrar["Prestamos"]];
        }else{
            $respuesta = ["estado" => false, "MSG" => "Prestamos no encontrados", "error" => $mostrar["Error capturada"]];
        }
        return convertidorJSON($respuesta);
    }
    
    

}

$peticion = $_POST['peticion'] ?? null;
$paquete = $_POST['paquete'] ?? null;
//convertidorJSON($paquete);//No pertenece al autores asi que existe adentro y fuera de la clase


$objAutores = new PrestamosController($peticion, $paquete);
$objAutores->Peticiones();
//print_r($ver);


#SIMULACION DE PETICIONES DE LOS CLIENTES
#EN EL CONTROLDAOR VA A REIBIR LA PETICION VAMOS A DEFINIR LA DUNCION "MOSTRAR AUTORS" DENTRO DE ELLA VAMMOS A INVICAR EL MODELO DEL PADRE LA FUNCION
?> 