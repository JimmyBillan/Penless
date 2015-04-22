<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Controller/Hashids.php";

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

    // Les groupes où je suis admin
    public function getGroupe($admin, $projection){
        $cursor =  $this->_collection->find(array(
        'admin' => array('$in' => array($admin))
        ), $projection)
        ;
        return $cursor;
        
    }

    public function getAllGroupId($idUser){
        // Retourne les groupes dans lesquels $user est soit Admin soit Utilisateur
        $projection = array("_id" => false, "idGroupe" => true);
        return $this->_collection->find(array('$or' => array(array('admin'     => array('$in' => array($idUser))) , 
                                                             array('arrayUser' => array('$in'  => array($idUser))))),
                                        $projection)        ;
        return $cursor;
        
    }

    public function getAllGroupIdArray($idUser) {
        $userGroupsCursor = $this->getAllGroupId($idUser);
        // Reformatage de la liste des groupes
        $userGroupsArray = [];
        foreach ($userGroupsCursor as $g) {
            array_push($userGroupsArray, $g["idGroupe"]);
        }
        return $userGroupsArray;
    }

    public function isGroupExist($idGroupe){
        $cursor = $this->_collection->find(array('idGroupe'=> $idGroupe));
        return ($cursor->count() > 0);
    }

    public function updateGroupe($idGroupe, $groupe){
        $criteria = array('idGroupe'=> $idGroupe);
        $this->_collection->update($criteria, array('$set' =>$groupe));
    }
    
    /*
    public function newclassInEcole($idEtablissement, $idClasse){
    	$criteria = array("idEtablissement" => $idEtablissement);
    	$newdata = array('$addToSet' => array("classe" => $idClasse));
    	$this->_collection->update($criteria, $newdata);
    }

     public function newUserInGroupe($idUser, $idGroupe){
    	$criteria = array("arrayUser" => $idGroupe);
    	$newdata = array('$addToSet' => array("classe" => $idUser));
    	$this->_collection->update($criteria, $newdata);
    }*/

    public function amIAdmin($idUser, $idGroup){
    $cursor = $this->_collection->find(array('$and' => array( array('idGroupe' => $idGroup), array('admin' => array('$in'  => array($idUser)))) ));
     return ($cursor->count() > 0);
     }

    public function deleteGroup($idUser, $idGroup){
         $cursor = $this->_collection->remove(array('$and' => array( array('idGroupe' => $idGroup), array('admin' => array('$in'  => array($idUser)))) ));
     return ($cursor);
    }

     public function isInGroup($idUser, $idGroup){
        return $this->_collection->findOne(array('$and' => array( array('idGroupe' => $idGroup), array('arrayUser' => array('$in'  => array($idUser)))) ));
    }

    public function listUserInGroup($idGroup, $projection){
        return $this->_collection->findOne(array('idGroupe' => $idGroup), $projection);
        
    }
 }