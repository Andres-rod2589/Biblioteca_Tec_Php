<?php
class DatabaseDB{
    private $host = 'localhost';
    private $dbname = 'biblioteca';
    private $user = 'root';
    private $password ='';


    public function __construct(){
    }
    protected function conectarDBPHP() {
        try {
            $pdo = new PDO("mysql:host=$this->host;dbname=$this->dbname", $this->user,$this->password);
            return $pdo;
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return null;
        }
    }
}
// al hacer la instancia de la clase invoco autmaticamnete el constructor que son los parentesis ()
//$connexion = new DatabaseDB();
//print_r($connexion);

//HACER PLANAS DE () 
//() esto es un constructor 10 veces

//Hacer lo mismo en Pyhton Pero en POO
?>
