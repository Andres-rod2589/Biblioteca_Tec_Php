<?php 
require_once '../Model/UsuariosModel.php';
require_once '../../Helpers/convertidorJSON.php';

class UsuariosController extends UsuariosModel {
    private $peticion = null;
    public function __construct($peticion= null, $paquete=null){
        parent::__construct($paquete);
        $this->peticion = $peticion;
    }

    public function Peticiones(){
        switch($this->peticion) {
            case 'Insertar_Usuarios':
                return $this->AgregarUsuarios();
            case 'All_Usuarios': // Añadir este caso
                return $this->MostrarUsuarios();
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
        } else {
            $respuesta = ["estado" => false, "MSG" => "Error de otro planeta"];
        }
        return convertidorJSON($respuesta);
    }

    // Añadir esta función
    public function MostrarUsuarios() {
        $mostrar = $this->ConsultarUsuarios();
        if($mostrar["estado"]){
            $respuesta = ["estado" => true, "MSG" => "Usuarios encontrados", "datos" => $mostrar["Usuarios"]];
        } else {
            $respuesta = ["estado" => false, "MSG" => "Usuarios no encontrados", "error" => $mostrar["Error capturada"]];
        }
        return convertidorJSON($respuesta);
    }
}

$peticion = $_POST['peticion'] ?? null;
$paquete = $_POST['paquete'] ?? null;

$objUsuarios = new UsuariosController($peticion, $paquete);
echo $objUsuarios->Peticiones();
?>