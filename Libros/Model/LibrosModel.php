<?php
require_once '../../Library/conexion.php';

class LibrosModel extends DatabaseDB{

    private $titulo;
    private $isbn;
    private $categoria;
    private $codigo;
    private $codigoNuevo;
    private $ejemplares;
    public function __construct($paquete = null){
        parent::__construct();
        $this -> titulo = $paquete['titulo'] ?? null;
        $this -> isbn = $paquete['isbn'] ?? null;
        $this -> categoria = $paquete['categoria'] ?? null;
        $this -> codigo = $paquete['autor'] ?? null;
        $this-> codigoNuevo = $paquete['isbn_nuevo'] ?? null;
        $this -> ejemplares = $paquete['ejemplares'] ?? null; 
    }

    public function AgregarEjemplares() {
        try {
            $id_libro = $this->getIdLibros();
            if (!$id_libro) {
                return ["estado" => false, "MSG" => "Libro no encontrado"];
            }
            $ejemplaresInsertados = 0;
            for ($i = 0; $i < $this->ejemplares; $i++) {    
                $sql = "INSERT INTO ejemplares (codigo, observaciones, id_libros) VALUES (:isbn, 'Bueno estado', :id_libro)";
                $execute = $this->conectarDBPHP()->prepare($sql);
                $arrayValues = [
                    ':isbn' => $this->isbn,
                    ':id_libro' => $id_libro
                ];
                $execute->execute($arrayValues);
                $ejemplaresInsertados += $execute->rowCount();
            }
        } catch (Exception $e) {
            return ["estado" => false, 'Error capturada' => $e->getMessage()];
        }
    }

    
    
    
    //CONSULTAR AUTORES Y LLENAR EL SELECT
    public function ConsultarAutores(){
        try {
            $sql = "SELECT CONCAT(nombres, ' ', a_paterno, ' ', a_materno) as nombre_completo, codigoAutor, id_autor FROM autores";
            $execute = $this->conectarDBPHP()->query($sql);
            $respuesta = $execute->fetchall(PDO::FETCH_ASSOC); //CONVIERTE  LA TABLA EN UN ARRAY  ASOCIATIVO (clave-valor)
            return ["estado" => true , 'Autor'=>  $respuesta];
        } catch (Exception $e) {
            return ["estado" => false , 'Error capturada'=>  $e->getMessage()];
        }
    }

    //CONSULTAR LIBROS Y LLENAR LA TABLA
    public function ConsultarLibros() {
        try {
            $sql = "SELECT 
                        l.id_libros, 
                        l.nombre, 
                        l.isbn, 
                        l.categoria, 
                        a.codigoAutor,
                        CONCAT(a.nombres, ' ', a.a_paterno, ' ', a.a_materno) AS autores,
                        COUNT(DISTINCT e.id_ejemplar) AS total_ejemplares
                    FROM libros l
                    INNER JOIN autores a ON l.id_autor = a.id_autor
                    LEFT JOIN ejemplares e ON l.id_libros = e.id_libros
                    GROUP BY l.id_libros, l.nombre, l.isbn, l.categoria, a.codigoAutor, a.nombres, a.a_paterno, a.a_materno";
    
            $execute = $this->conectarDBPHP()->query($sql);
            $respuesta = $execute->fetchAll(PDO::FETCH_ASSOC);
            
            return ["estado" => true, 'libros' => $respuesta];
        } catch (PDOException $e) {
            return ["estado" => false, 'error' => $e->getMessage()];
        }
    }
    
    
    
    

    //PARA TRAER EL ID. POR MEDIO DEL ISB ES DECIR EL CODIGO DEL LIBRO
    public function getIdLibros(){
        $sql ="SELECT id_libros FROM libros WHERE isbn = :isbn";
        $execute = $this->conectarDBPHP()->prepare($sql);
        $arrayValues = [
            ':isbn' => $this->isbn
        ];
        $execute -> execute($arrayValues);
        $result = $execute->fetch(PDO::FETCH_ASSOC);
        return $result ? $result['id_libros'] : null;
    }

    //PARA TRAER EL ID DE AUTOR POR MEDIO DEL CODIGO AUTOR 
    public function getIdAutores() {
        $sql = "SELECT id_autor FROM autores WHERE codigoAutor=:codigo";
        $execute = $this->conectarDBPHP()->prepare($sql); 
        $arrayValues = [
            ':codigo' => $this->codigo
        ];
        $execute->execute($arrayValues);
        $result = $execute->fetch(PDO::FETCH_ASSOC);
        return $result ? $result['id_autor'] : null;
    }

    //PARA INSERTAS LOS DATOS, POR MEDIO DEL MODAL. 
    public function InsertarLibros(){
        try{
            if ($this->getIdLibros() > 0){
                return ["estado" => false, "Existe" => "Libro ya existente"];
            }
            else {
                $idAutor = $this->getIdAutores(); // Obtener el ID real del autor
    
                if (!$idAutor) {
                    return ["estado" => false, "MSG" => "Error al insertar el autor", "Error" => "No se encontro un autor con ese codigo."];
                }
    
                $sql = "INSERT INTO libros (nombre, isbn, categoria, id_autor) VALUES (:titulo, :isbn, :categoria, :autor)";
                $execute = $this->conectarDBPHP()->prepare($sql); 
                $arrayValues = [
                    ':titulo'=>$this->titulo,
                    ':isbn'=>$this->isbn,
                    ':categoria'=>$this->categoria,
                    ':autor'=>$idAutor
                ];
                $execute->execute($arrayValues);
                $resul= $execute->rowCount(); 
                $execute->closeCursor();
                if ($resul > 0) {
                    $ejemplares = $this->AgregarEjemplares();
                    return ["estado" => true, "Insertado" => $resul];
                } else {
                    return ["estado" => false, "MSG" => "No se pudo insertar el libro"];
                }
            }
        }catch (Exception $e){
            return ["estado" => false, "Existe" => null, 'Error capturada' => $e->getMessage()];
        }
    }  


    public function EditarLibros() {
        try {
            $id_libros = $this->getIdLibros();
            if ($id_libros) {
                // Actualizar los datos del libro
                $sql = "UPDATE libros SET nombre = :titulo, isbn = :codigoNuevo, categoria = :categoria, id_autor = :autor WHERE id_libros = :id_libros";
                $execute = $this->conectarDBPHP()->prepare($sql);
                $arrayValues = [
                    ':titulo' => $this->titulo ?: null,
                    ':codigoNuevo' => $this->codigoNuevo,
                    ':categoria' => $this->categoria ?: null,
                    ':autor' => $this->getIdAutores(),
                    ':id_libros' => $id_libros
                ];
                $execute->execute($arrayValues);

                //ACTUSLIZA LOD DATOS DE EJEMPLARS
                //Cuanta la cantidad primero de libros con el id, que estan en la BD
                $cantidadejemplares = "SELECT COUNT(id_ejemplar) AS total_ejemplares FROM ejemplares WHERE id_libros = :id_libros";
                $execute = $this->conectarDBPHP()->prepare($cantidadejemplares);
                $execute->execute([':id_libros' => $id_libros]);
                $resultado = $execute->fetch(PDO::FETCH_ASSOC);
                $totalEjemplaresActuales = $resultado['total_ejemplares'];
    
                if ($this->ejemplares > $totalEjemplaresActuales) {
                    $nuevosEjemplares = $this->ejemplares - $totalEjemplaresActuales;
                    $insertarnuevosejemplares = "INSERT INTO ejemplares (codigo, observaciones, id_libros) VALUES (:isbn, 'Buen estado', :id_libros)";
                    $insertarejempla = $this->conectarDBPHP()->prepare($insertarnuevosejemplares);
                    for ($i = 0; $i < $nuevosEjemplares; $i++) {
                        $insertarejempla->execute([
                            ':isbn' => $this->isbn,
                            ':id_libros' => $id_libros]);
                    }

                } elseif ($this->ejemplares < $totalEjemplaresActuales) {
                    $sobrantes = $totalEjemplaresActuales - $this->ejemplares;
                    $sqlEliminar = "DELETE FROM ejemplares WHERE id_libros = :id_libros LIMIT :sobrantes";
                    $eliminar = $this->conectarDBPHP()->prepare($sqlEliminar);
                    $eliminar->bindParam(':id_libros', $id_libros, PDO::PARAM_INT);
                    $eliminar->bindValue(':sobrantes', $sobrantes, PDO::PARAM_INT);
                    $eliminar->execute();
                }
                
    
                return ["estado" => true, "Actualizado" => $execute->rowCount()];
            } else {
                return ["estado" => false, "noEncontrado" => "Libro no encontrado en la base de datos"];
            }
        } catch (Exception $e) {
            return ["estado" => false, "Error capturada" => $e->getMessage()];
        }
    }
    


 
    
    public function EliminarLibrp(){
        try{
            $id_libro = $this->getIdLibros();
            if($id_libro){
                $sqlejemplares = "DELETE FROM ejemplares WHERE id_libros=:id_libros";
                $eliminarEjemplar = $this->conectarDBPHP()->prepare($sqlejemplares);
                $eliminarEjemplars = [
                    ':id_libros' => $id_libro
                ];
                $eliminarEjemplar->execute($eliminarEjemplars);
                
                $sql = "DELETE FROM libros WHERE isbn = :isbn";
                $execute = $this->conectarDBPHP()->prepare($sql);
                $arrayValues = [
                    ':isbn' => $this->isbn
                ];
        
                $execute->execute($arrayValues);
                $resul = $execute->rowCount();
                $execute->closeCursor();
                
                if ($resul > 0) {
                    return ['estado' => true, 'Eliminado' => $resul]; 
                } else {
                    return ['estado' => false, 'MSG' => 'No se encontro el libro'];
                }
            }else {
                return ['estado' => false, 'MSG' => 'codigo no valido'];
            }
        }catch (Exception $e) {
            return ['estado' => false, 'Error' => $e->getMessage()];
        }
    }
}
?>