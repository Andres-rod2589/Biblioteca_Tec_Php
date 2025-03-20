<?php
require_once '../../Library/conexion.php';

class UsuariosModel extends DatabaseDB {

    private $nombre;
    private $apellido_p;
    private $apellido_m;
    private $numeroExt;
    private $numeroInt;
    private $telefono;
    private $codigo_postal;
    private $calle;
    private $codigoUsuario;


    public function __construct($paquete = null) {
        parent::__construct();
        $this->nombre = $paquete['nombre'] ?? null;
        $this->apellido_p = $paquete['apellido_pa'] ?? null;
        $this->apellido_m = $paquete['apellido_ma'] ?? null;
        $this->numeroExt = $paquete['numero_exterior'] ?? null;
        $this->numeroInt = $paquete['numero_interior'] ?? null;
        $this->telefono = $paquete['telefono'] ?? null;
        $this->codigo_postal = $paquete['codigo_postal'] ?? null;
        $this->calle = $paquete['calle'] ?? null;
        $this->codigoUsuario = $paquete['codigoUsuario'] ?? null;
    }

    public function codigoUsuario() {
        return rand(1000, 9999);
    }

    public function ConsultarUsuarios() {
        try {
            $sql = "SELECT nombre, ap_paterno, ap_materno, telefono, calle, n_exterior, n_interior, cp, CodigoUsuario FROM usuario";
            $execute = $this->conectarDBPHP()->query($sql);
            $respuesta = $execute->fetchAll(PDO::FETCH_ASSOC);
            return ["estado" => true, 'Usuario' => $respuesta];
        } catch (Exception $e) {
            return ["estado" => false, 'Error capturada' => $e->getMessage()];
        }
    }

    public function getIdUsuarios() {
        $sql = "SELECT id_usuario FROM usuario WHERE codigoUsuario = :codigoUsuario";
        $execute = $this->conectarDBPHP()->prepare($sql);
        $execute->execute([
            ':codigoUsuario' => $this->codigoUsuario
        ]);
        $result = $execute->fetch(PDO::FETCH_ASSOC);
        return $result ? $result['id_usuario'] : null;
    }
    
    

    public function InsertarUsuarios() {
        try {
            $sql = "SELECT id_usuario FROM usuario WHERE telefono = :telefono 
                    AND nombre = :nombre AND ap_paterno = :apellido_p AND ap_materno = :apellido_m";
            $execute = $this->conectarDBPHP()->prepare($sql);
            $execute->execute([
                ':telefono' => $this->telefono,
                ':nombre' => $this->nombre,
                ':apellido_p' => $this->apellido_p,
                ':apellido_m' => $this->apellido_m
            ]);
        
            if ($execute->rowCount() > 0) {
                return ["estado" => false, "Existe" => "Usuario ya existente con los mismos datos"];
            } else {
                $codigo = $this->codigoUsuario();
                $sqlInsert = "INSERT INTO usuario (nombre, ap_paterno, ap_materno, telefono, calle, n_exterior, n_interior, cp, codigoUsuario) 
                            VALUES (:nombre, :apellido_p, :apellido_m, :telefono, :calle, :numeroExt, :numeroInt, :codigo_postal, :codigoUsuario)";
                $executeInsert = $this->conectarDBPHP()->prepare($sqlInsert);
                $executeInsert->execute([
                    ':nombre' => $this->nombre,
                    ':apellido_p' => $this->apellido_p,
                    ':apellido_m' => $this->apellido_m,
                    ':telefono' => $this->telefono,
                    ':calle' => $this->calle,
                    ':numeroExt' => $this->numeroExt,
                    ':numeroInt' => $this->numeroInt,
                    ':codigo_postal' => $this->codigo_postal,
                    ':codigoUsuario' => $codigo
                ]);
                return ["estado" => true, "Insertado" => $executeInsert->rowCount()];
            }
        } catch (Exception $e) {
            return ["estado" => false, 'Error capturada' => $e->getMessage()];
        }
    }
    

    public function EditarUsuario() {
        try {
            $id_usuario = $this->getIdUsuarios();         
            if ($id_usuario) {  
                $sql = "UPDATE usuario SET nombre = :nombre, ap_paterno = :apellido_p, ap_materno = :apellido_m, telefono = :telefono, calle = :calle, n_exterior = :numeroExt, n_interior = :numeroInt, cp = :codigo_postal WHERE id_usuario = :id_usuario";
        
                $execute = $this->conectarDBPHP()->prepare($sql);
                $arrayValues = [
                    ':nombre' => $this->nombre ?: null,
                    ':apellido_p' => $this->apellido_p ?: null,
                    ':apellido_m' => $this->apellido_m ?: null,
                    ':telefono' => $this->telefono ?: null,
                    ':calle' => $this->calle ?: null,
                    ':numeroExt' => $this->numeroExt ?: null,
                    ':numeroInt' => $this->numeroInt ?: null,
                    ':codigo_postal' => $this->codigo_postal ?: null,
                    ':id_usuario' => $id_usuario
                ];
                
                $execute->execute($arrayValues);
                $resul = $execute->rowCount();
                $execute->closeCursor();
                if ($resul > 0) {
                    return ["estado" => true, "Actualizado" => $resul];
                } else {
                    return ["estado" => false, "MSG" => "No se realizaron cambios"];
                }
            } else {
                return ["estado" => false, "MSG" => "Usuario no encontrado en la base de datos"];
            }
        } catch (Exception $e) {
            return ["estado" => false, "Error" => $e->getMessage()];
        }
    }
    
    
        
    
}
?>
