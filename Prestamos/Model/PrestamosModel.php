<?php
require_once '../../Library/conexion.php';
 
class PestamosModel extends DatabaseDB{
    private $isbn;
    private $codigoUsuario;
    private $codigoEjemplar;
    private $fechaPrestamo;
    private $fechaDevolucion;
    private $estado;
    private $observaciones;
    private $id_prestamo; // Add id_prestamo property

    public function __construct($paquete = null){
        parent::__construct();
        $this->isbn = $paquete['isbn'] ?? null;
        $this->codigoUsuario = $paquete['codigoUsuario'] ?? null;
        $this->codigoEjemplar = $paquete['codigoEjemplar'] ?? null;
        $this->fechaPrestamo = $paquete['fechaPrestamo'] ?? null;
        $this->fechaDevolucion = $paquete['fechaDevolucion'] ?? null;
        $this->estado = $paquete['estado'] ?? null;
        $this->observaciones = $paquete['observaciones'] ?? null;
        $this->id_prestamo = $paquete['id_prestamo'] ?? null; // Set id_prestamo
    }

    public function ConsultarPrestamos() {
        try {
            $sql = "SELECT ejemplares.codigo AS Codigo, libros.nombre AS Libro, usuario.nombre AS Usuario, prestamo.fecha_prestamo AS FechaPrestamo, prestamo.fecha_devolucion AS FechaDevolucion, prestamo.estado AS Estado, ejemplares.observaciones AS Observaciones
                    FROM prestamo
                    INNER JOIN ejemplares ON prestamo.id_ejemplar = ejemplares.id_ejemplar
                    INNER JOIN libros ON ejemplares.id_libros = libros.id_libros
                    INNER JOIN usuario ON prestamo.id_usuario = usuario.id_usuario;";
                        
            $execute = $this->conectarDBPHP()->query($sql);
            $respuesta = $execute->fetchAll(PDO::FETCH_ASSOC);
            return ["estado" => true, 'Prestamos' => $respuesta];
    
        } catch (Exception $e) {
            return ["estado" => false, 'Error capturada' => $e->getMessage()];
        }
    }
    
    //CONSULTAR AUTORES Y LLENAR EL SELECT
    public function ConsultarLibros(){
        try {
            $sql = "SELECT DISTINCT libros.isbn, libros.nombre FROM libros 
            /*Unimos la tabla libros y ejemplares con el campo id_ibros*/
            INNER JOIN ejemplares ON libros.id_libros = ejemplares.id_libros 
            /*Despuues se hace una unios entre la tabla ejemplares y prestamo con el id_ejemplar*/
            LEFT JOIN prestamo ON ejemplares.id_ejemplar = prestamo.id_ejemplar 
            /*Poonemos un filtro para que solo nos seleccione los registros con Prestado */
            AND prestamo.estado = 'Prestado' 
            /*Y por ultimo la condicion donde solo selecciona los libros que no han sido prestados */
            WHERE prestamo.id_ejemplar IS NULL;";


            $execute = $this->conectarDBPHP()->query($sql);
            $respuesta = $execute->fetchall(PDO::FETCH_ASSOC); //CONVIERTE  LA TABLA EN UN ARRAY  ASOCIATIVO (clave-valor)
            return ["estado" => true , 'Libros'=>  $respuesta];
        } catch (Exception $e) {
            return ["estado" => false , 'Error capturada'=>  $e->getMessage()];
        }
    }

    public function ConsultarCodigoEjemplares(){
        try{
            $sql = "SELECT CONCAT(ejemplares.codigo, ' ', libros.nombre)AS ejemplares, ejemplares.codigo FROM libros 
            INNER JOIN ejemplares ON libros.id_libros = ejemplares.id_libros
            LEFT JOIN prestamo ON ejemplares.id_ejemplar = prestamo.id_ejemplar 
            AND prestamo.estado = 'Prestado' WHERE prestamo.id_ejemplar IS NULL AND libros.isbn = :isbn ;";
            
            $execute = $this->conectarDBPHP()->prepare($sql);
            $execute->execute([
                ':isbn' => $this->isbn
            ]);
            $respuesta = $execute->fetchall(PDO::FETCH_ASSOC); //CONVIERTE  LA TABLA EN UN ARRAY  ASOCIATIVO (clave-valor)
            return ["estado" => true , 'CodigoEjemplares'=>  $respuesta];
        }catch (Exception $e){
            return ["estado" => false , 'Error capturada'=>  $e->getMessage()];
        }
    }

    public function MostrarUsuariosEjemplares() {
         try {
            $sql = "SELECT usuario.codigoUsuario,
                    CONCAT(usuario.nombre, ' ', usuario.ap_paterno, ' ', usuario.ap_materno, ' - ', 
                    COALESCE(ultimo_prestamo.estado, 'Sin prestamo')) AS nombre_completo
                    FROM usuario
                    LEFT JOIN (SELECT id_usuario, estado FROM prestamo
                    WHERE fecha_prestamo = (SELECT MAX(fecha_prestamo)FROM prestamo p2 WHERE prestamo.id_usuario = p2.id_usuario)
                ) AS ultimo_prestamo
                ON usuario.id_usuario = ultimo_prestamo.id_usuario;
            ";
        $execute = $this->conectarDBPHP()->query($sql);
        $usuarios = $execute->fetchAll(PDO::FETCH_ASSOC);
        
    
        return ["estado" => true, 'UsuarioEjemplares' => $usuarios];
        } catch (Exception $e) {
            return ["estado" => false, 'Error capturada' => $e->getMessage()];
        }
    }

    public function ObtenerIdUsuario() {
        try {
            $sql = "SELECT id_usuario FROM usuario WHERE codigoUsuario = :codigoUsuario;";
            $execute = $this->conectarDBPHP()->prepare($sql);
            $execute->execute([
                ':codigoUsuario' => $this->codigoUsuario
            ]);
            $respuesta = $execute->fetch(PDO::FETCH_ASSOC);

            // Debugging log
            if (!$respuesta) {
                error_log("No user found for codigoUsuario: " . $this->codigoUsuario);
            } else {
                error_log("User found: " . json_encode($respuesta));
            }

            return $respuesta['id_usuario'] ?? null;
        } catch (Exception $e) {
            error_log("Error in ObtenerIdUsuario: " . $e->getMessage());
            return null;
        }
    }
    
    public function ObtenerIdEjemplar() {
        $sql = "SELECT id_ejemplar FROM ejemplares WHERE codigo = :codigoEjemplar;";
        $execute = $this->conectarDBPHP()->prepare($sql);
        $execute->execute([
            ':codigoEjemplar' => $this->codigoEjemplar
        ]);
        $respuesta = $execute->fetch(PDO::FETCH_ASSOC);
        return $respuesta['id_ejemplar'] ?? null;
    }

    public function InsertarPrestamo() {
        try {
            $id_usuario = $this->ObtenerIdUsuario();
            $id_ejemplar = $this->ObtenerIdEjemplar();

            if (!$id_usuario) {
                return ["estado" => false, 'Error' => 'El usuario no existe.'];
            }
            if (!$id_ejemplar) {
                return ["estado" => false, 'Error' => 'El ejemplar no existe.'];
            }
    
            $sql = "SELECT estado FROM prestamo WHERE id_usuario = :id_usuario AND estado = 'Prestado';";
            $execute = $this->conectarDBPHP()->prepare($sql);
            $execute->execute([':id_usuario' => $id_usuario]);
            $resultado = $execute->fetch(PDO::FETCH_ASSOC);
    
            if ($resultado) {
                return ["estado" => false, 'Error' => 'El usuario ya tiene un libro prestado y no puede generar otro prsstamo.'];
            }
    
            $sql = "INSERT INTO prestamo (id_usuario, id_ejemplar, fecha_prestamo, fecha_devolucion, estado) 
                    VALUES (:id_usuario, :id_ejemplar, :fecha_prestamo, :fecha_devolucion, :estado);";
            $execute = $this->conectarDBPHP()->prepare($sql);
            $execute->execute([
                ':id_usuario' => $id_usuario,
                ':id_ejemplar' => $id_ejemplar,
                ':fecha_prestamo' => $this->fechaPrestamo,
                ':fecha_devolucion' => $this->fechaDevolucion,
                ':estado' => $this->estado
            ]);
    
            $sql = "UPDATE ejemplares SET observaciones = :observaciones WHERE id_ejemplar = :id_ejemplar;";
            $execute = $this->conectarDBPHP()->prepare($sql);
            $execute->execute([
                ':observaciones' => $this->observaciones,
                ':id_ejemplar' => $id_ejemplar
            ]);
    
            return ["estado" => true, 'MSG' => 'Preestamo agregado exitosamente'];
        } catch (Exception $e) {
            return ["estado" => false, 'Error capturada' => $e->getMessage()];
        }
    }

    public function EditarPrestamo() {
        try {
            if (!$this->id_prestamo) {
                return ["estado" => false, "Error" => "El id_prestamo es requerido."];
            }
    
            // Conectar a la base de datos
            $db = $this->conectarDBPHP();
            $db->beginTransaction(); // Iniciar transacción
    
            // Actualizar el préstamo
            $sql = "UPDATE prestamo 
                    SET fecha_devolucion = :fecha_devolucion, estado = :estado 
                    WHERE id_prestamo = :id_prestamo";
            $stmt = $db->prepare($sql);
            $stmt->execute([
                ':fecha_devolucion' => $this->fechaDevolucion,
                ':estado' => $this->estado,
                ':id_prestamo' => $this->id_prestamo
            ]);
    
            // Actualizar observaciones en ejemplares
            $sql = "UPDATE ejemplares 
                    SET observaciones = :observaciones 
                    WHERE id_ejemplar = (SELECT id_ejemplar FROM prestamo WHERE id_prestamo = :id_prestamo)";
            $stmt = $db->prepare($sql);
            $stmt->execute([
                ':observaciones' => $this->observaciones,
                ':id_prestamo' => $this->id_prestamo
            ]);
    
            // Confirmar transacción
            $db->commit();
            return ["estado" => true, "MSG" => "Préstamo actualizado correctamente"];
            
        } catch (Exception $e) {
            // Revertir cambios si hay un error
            if (isset($db)) {
                $db->rollBack();
            }
    
            error_log("Error en EditarPrestamo: " . $e->getMessage());
            return ["estado" => false, "Error" => $e->getMessage()];
        }
    }

    public function EliminarPrestamo($id_prestamo) {
        try {
            if (!$id_prestamo) {
                return ["estado" => false, "Error" => "El id_prestamo es requerido."];
            }
    
            error_log("Intentando eliminar el préstamo con ID: " . $id_prestamo);
    
            // Conectar a la base de datos
            $db = $this->conectarDBPHP();
            $db->beginTransaction(); // Iniciar transacción
    
            // Verificar si el préstamo existe antes de eliminarlo
            $sql = "SELECT id_prestamo FROM prestamo WHERE id_prestamo = :id_prestamo";
            $stmt = $db->prepare($sql);
            $stmt->execute([':id_prestamo' => $id_prestamo]);
    
            if ($stmt->rowCount() === 0) {
                $db->rollBack();
                return ["estado" => false, "Error" => "No se encontró el préstamo con el ID proporcionado."];
            }
    
            // Eliminar el préstamo
            $sql = "DELETE FROM prestamo WHERE id_prestamo = :id_prestamo";
            $stmt = $db->prepare($sql);
            $stmt->execute([':id_prestamo' => $id_prestamo]);
    
            if ($stmt->rowCount() > 0) {
                $db->commit(); // Confirmar eliminación
                return ["estado" => true, "MSG" => "Préstamo eliminado correctamente."];
            } else {
                $db->rollBack();
                return ["estado" => false, "Error" => "No se pudo eliminar el préstamo."];
            }
        } catch (Exception $e) {
            if (isset($db)) {
                $db->rollBack();
            }
            error_log("Error en EliminarPrestamo: " . $e->getMessage());
            return ["estado" => false, "Error" => $e->getMessage()];
        }
    }
    
    
}
?>