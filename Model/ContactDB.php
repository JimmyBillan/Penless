<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
include $root."/Controller/userServices.php";
require_once "Hashids.php";

class groupDbConnection {
    var $_m;
    var $_db;
    var $_collection;
    
    public function __construct()
    {
        $this->_m          = new MongoClient("localhost:27017");
        $this->_db         = $this->_m->penless;
        $this->_collection = $this->_db->Group;
    }

    public function CreerEtablissement($idEtablissement, $nom, $admin)
    {
    	$this->_collection->insert(array(
    		"Type"	  			=> "ecole",
    		"idEtablissement" 	=> $idEtablissement,
			"Nom"				=> $Nom,
			"classe"			=> [],
			"admin"				=>[]));
    }

    public function initGroup($nomGroupe, $idGroupe, $admin){
        $hashids = new Hashids("PenlesssaléeGroup"); 
        $idGroupe += microtime(true) * 10000;
        $id = $hashids->encode($idGroupe);
    	$result = $this->_collection->insert(array("idGroupe" => $id, "nom" => $nomGroupe, "arrayUser" => $arrayUser, "admin" => $admin, "date" => new MongoDate()));
        echo "init_success";
    }

    public function newclassInEcole($idEtablissement, $idClasse){
    	$criteria = array("idEtablissement" => $idEtablissement);
    	$newdata = array('$addToSet' => array("classe" => $idClasse));
    	$this->_collection->update($criteria, $newdata);
    }

     public function newUserInGroupe($idUser, $idGroupe){
    	$criteria = array("arrayUser" => $idGroupe);
    	$newdata = array('$addToSet' => array("classe" => $idUser));
    	$this->_collection->update($criteria, $newdata);
    }

 }