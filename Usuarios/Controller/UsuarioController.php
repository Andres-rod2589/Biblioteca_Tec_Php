<?php 
require_once '../Model/UsuariosModel.php';
require_once '../../Helpers/convertidorJSON.php';

class AutoresController extends UsuariosModel{
    private $peticion = null;
    public function __construct($peticion= null, $paquete=null){
        parent::__construct($paquete);
        $this->peticion = $peticion;
    }

    //HACER UN SWITCH 
    //EL PIMER CASO QUE SE LLAME GET AUTORES (CONSULTARUsuarios) e invocar
    public function Peticiones(){
        switch($this->peticion) {
            case 'Insertar_Usuarios':
                return $this->AgregarUsuarios();
            case 'All_Usuarios':
                return $this->MostrarUsuarios();
            case 'Actualizar_Usuarios':
                return $this->ActualizarUsuarios();
            default:
                return convertidorJSON(["estado" => False, "MSG" => "Peticion desconocida"]);
        }
    }

    public function AgregarUsuarios() {
        $resultado = $this->InsertarUsuarios();
        if ($resultado["estado"]) {
            $respuesta = ["estado" => true, "MSG" => "Usuario insertado correctamente", "Insertado" => $resultado['Insertado']];
        } elseif ($resultado["Existe"]) {
            $respuesta = ["estado" => false, "MSG" => $resultado['Existe']];
        } elseif($resultado['Error capturada']) {
            $respuesta = [ "estado" => false, "MSG" => "Error al insertar el usuario", "Error" => $resultado['Error capturada']];
        }else {
            $respuesta = ["estado" => false, "MSG" => "Error de otro planeta"];
        }
        return convertidorJSON($respuesta);
    }

    public function MostrarUsuarios(){
        $mostrar = $this->ConsultarUsuarios();
        if($mostrar["estado"]){
            $respuesta = ["estado" => true, "MSG" => "Usuarios encontrados", "datos" => $mostrar["Usuario"]];
        }else{
            $respuesta = ["estado" => false, "MSG" => "Usuarios no encontrados", "error" => $mostrar["Error capturada"]];
        }
        return convertidorJSON($respuesta);
    }

    public function ActualizarUsuarios() {
        $resultado = $this->EditarUsuario();
    
        if ($resultado["estado"]) {$respuesta = [ "estado" => true,  "MSG" => "Autor actualizado correctamente", "Actualizado" => $resultado['Actualizado']];
        } elseif ($resultado["MSG"]) { 
              $respuesta = ["estado" => false, "MSG" => $resultado['MSG'] ];
        } elseif ($resultado["Error"]) {
            $respuesta = ["estado" => false, "MSG" => "Error al actualizar el autor", "Error" => $resultado['Error'] ];
        } else {
            $respuesta = ["estado" => false, "MSG" => "Error desconocido"];
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