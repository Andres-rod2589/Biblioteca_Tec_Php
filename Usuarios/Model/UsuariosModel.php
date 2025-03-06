<?php
require_once '../../Library/conexion.php';

class UsuariosModel extends DatabaseDB{

    private $nombre;
    private $apellido_p;
    private $apellido_m;
    private $numeroExt;
    private $numeroInt;
    private $telefono;
    private $codigo_postal;
    private $calle; 
    public function __construct( $paquete=null){
        parent::__construct();
        $this -> nombre = $paquete['nombre'] ?? null;
        $this -> apellido_p = $paquete['apellido_pa'] ?? null;
        $this -> apellido_m = $paquete['apellido_ma'] ?? null;
        $this ->numeroExt = $paquete['numero_exterior'] ?? null;
        $this ->numeroInt = $paquete['numero_interior'] ?? null;
        $this ->telefono = $paquete['telefono'] ?? null;
        $this ->codigo_postal = $paquete['codigo_postal'] ?? null;
        $this ->calle = $paquete['calle'] ?? null;
    }

    public function codigoUsuario()
    {
        $numero_aleatorio = rand(1000, 9999);
        return $numero_aleatorio;
    }
    public function verificarExiste(){
    }

    public function getIdUsuarios() {
        $numero_aleatorio = $this->codigoUsuario();
        $sql = "SELECT id_usuario FROM usuario WHERE nombre=:nombre and ap_paterno=:apellido_p and ap_materno=:apellido_m and telefono=:telefono";
        $execute = $this->conectarDBPHP()->prepare($sql); 
        $arrayValues = [
            ':nombre'=>$this->nombre,
            ':apellido_p'=>$this->apellido_p,
            ':apellido_m'=>$this->apellido_m,
            ':telefono' => $this->telefono,
        ];
        $execute->execute($arrayValues);
        $result = $execute->fetch(PDO::FETCH_ASSOC);
        return $result ? $result['id_usuario'] : null;
    }

    // Consultar usuarios y llenar la tabla
    public function ConsultarUsuarios() {
        try {
            $sql = "SELECT nombre, ap_paterno, ap_materno, telefono, calle, n_exterior, n_interior, cp FROM usuario";
            $execute = $this->conectarDBPHP()->query($sql);
            $respuesta = $execute->fetchAll(PDO::FETCH_ASSOC); // Convierte la tabla en un array asociativo (clave-valor)
            return ["estado" => true, "Usuarios" => $respuesta];
        } catch (Exception $e) {
            return ["estado" => false, "Error capturada" => $e->getMessage()];
        }
    }

    //Insertar datos pero que si ese usuario ya esxiste que no lo haga y si no exxiste.
//INSERTAR  UN NUEVO Usuario
    public function InsertarUsuarios(){
        try{
            if ($this->getIdUsuarios() > 0){
                return ["estado" => false, "Existe" => "Autor ya existente"];
            }
            else {
                $numero_aleatorio = $this->codigoUsuario();
                $sql = "INSERT INTO usuario (nombre, ap_paterno, ap_materno, telefono, calle, n_exterior, n_interior, cp, CodigoUsuario) VALUES (:nombre, :apellido_p, :apellido_m, :telefono, :calle, :numeroExt, :numeroInt, :codigo_postal, :CodigoUsuario)";
                $execute = $this->conectarDBPHP()->prepare($sql); //prepare: solo va a preparar y va a esperar las claves
                $arrayValues = [
                    ':nombre'=>$this->nombre,
                    ':apellido_p'=>$this->apellido_p,
                    ':apellido_m'=>$this->apellido_m,
                    ':telefono' => $this->telefono,
                    ':calle' => $this->calle,
                    ':numeroExt' => $this->numeroExt,
                    ':numeroInt' => $this->numeroInt,
                    ':codigo_postal' => $this->codigo_postal,
                    ':CodigoUsuario' => $numero_aleatorio
                ];
                $execute->execute($arrayValues);
                $resul= $execute->rowCount(); 
                $execute->closeCursor();
                return ["estado" => true, "Insertado" => $resul];
            }
        }catch (Exception $e){
            return ["estado" => false, "Existe" => null, 'Error capturada' => $e->getMessage()];
        }
    }    
}
?>