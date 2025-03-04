<?php 
require_once '../Model/AutoresModel.php';
require_once '../../Helpers/convertidorJSON.php';

class AutoresController extends AutoresModel{
    private $peticion = null;
    public function __construct($peticion= null, $paquete=null){
        parent::__construct($paquete);
        $this->peticion = $peticion;
    }

    //HACER UN SWITCH 
    //EL PIMER CASO QUE SE LLAME GET AUTORES (CONSULTARAutores) e invocar
    public function Peticiones(){
        switch($this->peticion) {
            case 'All_Autores':
                return $this->MostrarAutores();
            case 'Insertar_Autores':
                return $this->AgregarAutores();
            case 'Actualizar_Autores':
                return $this->ActualizarAutores();
            default:
                return convertidorJSON(["estado" => False, "MSG" => "Peticion desconocida"]);
        }
    }

    public function MostrarAutores(){
        $mostrar = $this->ConsultarAutores();
        if($mostrar["estado"]){
            $respuesta = ["estado" => true, "MSG" => "Autores encontrados", "datos" => $mostrar["Autores"]];
        }else{
            $respuesta = ["estado" => false, "MSG" => "Autores no encontrados", "error" => $mostrar["Error capturada"]];
        }
        return convertidorJSON($respuesta);
    }

    public function AgregarAutores() {
        $resultado = $this->InsertarAutores();
        if ($resultado["estado"]) {
            $respuesta = ["estado" => true, "MSG" => "Autor insertado correctamente", "Insertado" => $resultado['Insertado']];
        } elseif ($resultado["Existe"]) {
            $respuesta = ["estado" => false, "MSG" => $resultado['Existe']];
        } elseif($resultado['Error capturada']) {
            $respuesta = [ "estado" => false, "MSG" => "Error al insertar el autor", "Error" => $resultado['Error capturada']];
        }else {
            $respuesta = ["estado" => false, "MSG" => "Error de otro planeta"];
        }
        return convertidorJSON($respuesta);
    }

    public function ActualizarAutores() {
        $resultado = $this->EditarAutor();
        
        if ($resultado["estado"]) {
            $respuesta = ["estado" => true, "MSG" => "Autor actualizado correctamente", "Actualizado" => $resultado['Actualizado']];
        } elseif ($resultado["MSG"] ) {
            $respuesta = ["estado" => false, "MSG" => $resultado['MSG']];
        } elseif ($resultado["noEncontrado"]) {
            $respuesta = ["estado" => false, "MSG" => $resultado['noEncontrado']];
        } elseif ($resultado['Error capturada']) {
            $respuesta = ["estado" => false, "MSG" => "Error al actualizar el autor", "Error" => $resultado['Error capturada']];
        } else {
            $respuesta = ["estado" => false, "MSG" => "Error de otro planeta"];
        }
    
        return convertidorJSON($respuesta);
    }
}

$peticion = $_POST['peticion'] ?? null;
$paquete = $_POST['paquete'] ?? null;
//convertidorJSON($paquete);//No pertenece al autores asi que existe adentro y fuera de la clase


$objAutores = new AutoresController($peticion, $paquete);
$objAutores->Peticiones();
//print_r($ver);


#SIMULACION DE PETICIONES DE LOS CLIENTES
#EN EL CONTROLDAOR VA A REIBIR LA PETICION VAMOS A DEFINIR LA DUNCION "MOSTRAR AUTORS" DENTRO DE ELLA VAMMOS A INVICAR EL MODELO DEL PADRE LA FUNCION
?> 