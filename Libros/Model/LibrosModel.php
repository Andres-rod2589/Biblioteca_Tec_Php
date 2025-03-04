<?php
require_once '../../Library/conexion.php';

class LibrosModel extends DatabaseDB{

    private $titulo;
    private $isbn;
    private $categoria;
    private $codigo;
    private $codigoNuevo;
    public function __construct($paquete = null){
        parent::__construct();
        $this -> titulo = $paquete['titulo'] ?? null;
        $this -> isbn = $paquete['isbn'] ?? null;
        $this -> categoria = $paquete['categoria'] ?? null;
        $this -> codigo = $paquete['autor'] ?? null;
        $this-> codigoNuevo = $paquete['isbn_nuevo'] ?? null;
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
    public function ConsultarLibros(){
        try {
            $sql = "SELECT l.id_libros, l.nombre, l.isbn, l.categoria, a.codigoAutor,
                    CONCAT(a.nombres, ' ', a.a_paterno,' ', a.a_materno) AS autores
                FROM libros l
                INNER JOIN autores a ON l.id_autor = a.id_autor";

            $execute = $this->conectarDBPHP()->query($sql);
            $respuesta = $execute->fetchall(PDO::FETCH_ASSOC); //CONVIERTE  LA TABLA EN UN ARRAY  ASOCIATIVO (clave-valor)
            return ["estado" => true , 'Libros'=>  $respuesta];
        } catch (Exception $e) {
            return ["estado" => false , 'Error capturada'=>  $e->getMessage()];
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
                return ["estado" => true, "Insertado" => $resul];
            }
        }catch (Exception $e){
            return ["estado" => false, "Existe" => null, 'Error capturada' => $e->getMessage()];
        }
    }
    // actualizar los libros
    public function EditarLibros() {
        try {
            $id_libros = $this->getIdLibros();
            if ($id_libros) { 
                // Si hay libros ya insertaods
                $verificarCodigoLibros = "SELECT id_libros FROM libros WHERE isbn = :codigoNuevo AND id_libros != :id_libros";
                $verificar = $this->conectarDBPHP()->prepare($verificarCodigoLibros);
                $verificar->execute([
                    ':codigoNuevo' => $this->codigoNuevo,
                    ':id_libros' => $id_libros
                ]);
                $Existe = $verificar->fetch(PDO::FETCH_ASSOC);
                
                if ($Existe) {
                    return ["estado" => false, "MSG" => "El codigo del libro ya esta en uso, verifica tus datos"];
                } else {
                    // Acrulizar los datos de los libross 
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
                    $resul = $execute->rowCount();
                    $execute->closeCursor();
                    return ["estado" => true, "Actualizado" => $resul];
                }
            } else {
                return ["estado" => false, "noEncontrado" => "Libro no encontrado en la base de datos"];
            }
        } catch (Exception $e) {
            return ["estado" => false, "Error capturada" => $e->getMessage()];
        }
    }

    public function EliminarLibro() {
        try {
            if ($this->isbn) {
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
            } else {
                return ['estado' => false, 'MSG' => 'codigo no valido'];
            }
        } catch (Exception $e) {
            return ['estado' => false, 'Error' => $e->getMessage()];
        }
    }
    
}

?>

