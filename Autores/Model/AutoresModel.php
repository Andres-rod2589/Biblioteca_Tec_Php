<?php
require_once '../../Library/conexion.php';

class AutoresModel extends DatabaseDB{

    private $nombre;
    private $apellido_p;
    private $apellido_m;
    private $nacionalidad;
    private $codigo;
    private $codigoNuevo;
    public function __construct( $paquete=null){
        parent::__construct();
        $this -> nombre = $paquete['nombre'] ?? null;
        $this -> apellido_p = $paquete['apellido_pa'] ?? null;
        $this -> apellido_m = $paquete['apellido_ma'] ?? null;
        $this -> nacionalidad = $paquete['nacionalidad'] ?? null;
        $this ->codigo = $paquete['codigo_autor'] ?? null;
        $this->codigoNuevo = $paquete['codigo_autor_nuevo'] ?? null;
    }

//CONSULTARAutores TODOS LOS AUTORES QUE HAY EN LA BASE DE DATOS
    public function ConsultarAutores(){
        try {
            $sql = "SELECT * FROM Autores";
            $execute = $this->conectarDBPHP()->query($sql);
            $respuesta = $execute->fetchall(PDO::FETCH_ASSOC); //CONVIERTE  LA TABLA EN UN ARRAY  ASOCIATIVO (clave-valor)
            return ["estado" => true , 'Autores'=>  $respuesta];
        } catch (Exception $e) {
            return ["estado" => false , 'Error capturada'=>  $e->getMessage()];
        }
    }

    //HACER UN METODO QUE SE LLAME GETIDAUTORES que solo devuelva el ID como condicion solo deben reotnar el id como argumentos pasaremos el nombre apelli
    //apellido nacinalodad
//OBTENER EL ID DEL AUTOR
    public function getIdAutores() {
        $sql = "SELECT id_autor FROM Autores WHERE codigoAutor=:codigo";
        $execute = $this->conectarDBPHP()->prepare($sql); 
        $arrayValues = [
            ':codigo' => $this->codigo
        ];
        $execute->execute($arrayValues);
        $result = $execute->fetch(PDO::FETCH_ASSOC);
        return $result ? $result['id_autor'] : null;
    }

    //Insertar datos pero que si ese usuario ya esxiste que no lo haga y si no exxiste.
//INSERTAR  UN NUEVO AUTOR
    public function InsertarAutores(){
        try{
            if ($this->getIdAutores() > 0){
                return ["estado" => false, "Existe" => "Autor ya existente"];
            }
            else {
                $sql = "INSERT INTO autores (nombres, a_paterno, a_materno, nacionalidad, codigoAutor) VALUES (:nombre, :apellido_p, :apellido_m, :nacionalidad, :codigo)";
                $execute = $this->conectarDBPHP()->prepare($sql); //prepare: solo va a preparar y va a esperar las claves
                $arrayValues = [
                    ':nombre'=>$this->nombre,
                    ':apellido_p'=>$this->apellido_p,
                    ':apellido_m'=>$this->apellido_m,
                    ':nacionalidad'=>$this->nacionalidad,
                    ':codigo' => $this->codigo
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

//HACER LA FUNCION DE EDITAR
//EDITAR UN AUTOR
public function EditarAutor() {
    try {
        $id_autor = $this->getIdAutores();
        if ($id_autor) { 
            // Verificar si el nuevo código ya está en uso
            $verificarCodigoAutor = "SELECT id_autor FROM autores WHERE codigoAutor = :codigoNuevo AND id_autor != :id_autor";
            $verificar = $this->conectarDBPHP()->prepare($verificarCodigoAutor);
            $verificar->execute([
                ':codigoNuevo' => $this->codigoNuevo,
                ':id_autor' => $id_autor 
            ]);
            $Existe = $verificar->fetch(PDO::FETCH_ASSOC);
            
            if ($Existe) {
                return ["estado" => false, "MSG" => "El código de autor ya está en uso, verifica tus datos"];
            } else {
                // Actualizar datos del autor
                $sql = "UPDATE autores SET nombres = :nombre, a_paterno = :apellido_p, a_materno = :apellido_m, nacionalidad = :nacionalidad, codigoAutor = :codigoNuevo WHERE id_autor = :id_autor";
                $execute = $this->conectarDBPHP()->prepare($sql);
                $arrayValues = [
                    ':nombre' => $this->nombre ?: null,
                    ':apellido_p' => $this->apellido_p ?: null,
                    ':apellido_m' => $this->apellido_m ?: null,
                    ':nacionalidad' => $this->nacionalidad ?: null,
                    ':codigoNuevo' => $this->codigoNuevo,
                    ':id_autor' => $id_autor
                ];
                $execute->execute($arrayValues);
                $resul = $execute->rowCount();
                $execute->closeCursor();
                return ["estado" => true, "Actualizado" => $resul];
            }
        } else {
            return ["estado" => false, "noEncontrado" => "Autor no encontrado en la base de datos"];
        }
    } catch (Exception $e) {
        return ["estado" => false, "Error capturada" => $e->getMessage()];
    }
}

    //HACER EL DE ELIMINAR
//ELIMNAR UN AUTOR
    public function EliminarAutor() {
        $id_autor = $this->getIdAutores();
        if ($id_autor) {
            $sql = "DELETE FROM autores WHERE id_autor = :id_autor";
            $execute = $this->conectarDBPHP()->prepare($sql);
            $arrayValues = [':id_autor' => $id_autor];
            
            $execute->execute($arrayValues);
            $resul = $execute->rowCount();
            $execute->closeCursor();
    
            return 'Autor eliminado con éxito';
        } else {
            return 'Autor no encontrado en la base de datos';
        }
    }
    
}

//$objAutores = new AutoresModel(nombre: 'Ana',apellido_p: 'Guevara',apellido_m: 'Islas',nacionalidad: 'Mexicana',codigo: 'A05',codigoNuevo: 'A05');
//$autores = $objAutores->ConsultarAutores();
//print_r($autores[1]["a_materno"]);//Aqui traemos
//$result = $objAutores->EditarAutor('Marimar', 'Gomez', 'Bonilla', 'Brasil');
//$result = $objAutores->EditarAutor();
//print_r($autores );



//$ID = $objAutores->getIdAutores();
//print_r($ID)
?>