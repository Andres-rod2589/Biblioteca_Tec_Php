<?php
class DatabaseDB{
    private $host = 'localhost';
    private $dbname = 'bblio-laf';
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
?>