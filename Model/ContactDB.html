<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
include $root."/Controller/userServices.php";

class ContactGestion {
    var $_m;
    var $_db;
    var $_collection;
    
    public function __construct()
    {
        $this->_m          = new MongoClient("localhost:27017");
        $this->_db         = $this->_m->penless;
        $this->_collection = $this->_db->Contact;
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

    public function CreerGroupe($arrayUser, $nomGroupe, $idGroupe, $admin){
    	$this->_collection->insert(array(
    	"type" => "classe","idGroupe" => $idGroupe, "nom" => $nomGroupe, "arrayUser" => $arrayUser, "admin" => $admin));
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