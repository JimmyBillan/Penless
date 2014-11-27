<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
include $root."/Controller/userServices.php";

class UserDbConnection {
    var $_m;
    var $_db;
    var $_collection;
    var $_cursor;

    public function __construct()
    {
        $this->_m          = new MongoClient("localhost:27017");
        $this->_db         = $this->_m->penless;
        $this->_collection = $this->_db->User;
    }

    public function MailExistsInDb($mail)
    {
        $cursor = $this->_collection->find(array("mail" => $mail));
        return ($cursor->count() > 0);      
    } 
    
    public function MailAndKeyExistInDb($mail, $cle)
    {
        $cursor = $this->_collection->find(array("mail" => $mail, "clemdpchange" => $cle));
        return ($cursor->count() > 0);      
    } 
    
    public function CountInDb($mail)
    {
        $cursor = $this->_collection->find(array("mail" => $mail));
        return ($cursor->count());      
    }
    
    public function InsertUser($idUrl, $mail, $nom, $prenom, $dateInscription, $datePassword, $hashedPassword)
    {
        $this->_collection->insert(array("idUrl"                    => $idUrl,
                                         "mail"                     => $mail,
                                         "nom"                      => $nom,
                                         "prenom"                   => $prenom,
                                         "dateInscription"          => $dateInscription,
                                         "dateModificationPassword" => $datePassword,
                                         "password"                 => $hashedPassword,
                                         "contact"                  => array(),
                                         "notificationMail"         => true,
                                         "NotificiationAttente"     => array()));
        //return $this->_collection->findOne(array("mail" => $mail))['id'];
    }

    
    /*public function UpdateWithToken($id, $token)
    {
        $filter = array('_id' => $id);
        $update = array( '$set' =>array('tokenPC' => $token));
        $this->_collection->update($filter, $update);
    }*/
    
    public function UpdateWithKey($mail, $cle)
    {
        $filter = array('mail' => $mail);
        $update = array( '$set' =>array('clemdpchange' => $cle));
        $this->_collection->update($filter, $update);
    }
    
    public function UpdateWithPassword($mail, $cle, $password, $dateModificationPassword)
    {
        $filter = array("mail" => $mail, "clemdpchange"=>$cle);
        $hashedPassword = hashPassword($dateModificationPassword, $password);
        $update = array('$set' =>array ("password"=>$hashedPassword , 
                                        "dateModificationPassword" => $dateModificationPassword), 
                        '$unset' => array("clemdpchange" => true));
        $this->_collection->update($filter, $update);
    }

    function GetUserId($mail, $password)
    { 
        $matchingUser = $this->_collection->findOne(array("mail" => $mail));
    
        if($matchingUser == null){
            return "UNKNOWN_MAIL";
           }
        else{
            $hashedPassword = hashPassword($matchingUser['dateModificationPassword'], $password);
            // CKE Le hachage doit-il se faire côté client ou serveur?
            if( $hashedPassword === $matchingUser['password']){
                return  $matchingUser['idUrl'];
            }
            else{
                return "WRONG_PASSWORD";    
            }

        }
    }

    public function FindUserWithHisidUrlANDProjection($target, $projection){
        return $this->_collection->findOne(array("idUrl" => $target), $projection);
        
    }

    public function FindInContactList($myself, $target){
       
    $this->_cursor = $this->_collection->findOne(array("idUrl" => $myself));
    $resultat = array();
    
        if(count($this->_cursor["contact"]) != 0){

            for ($i=0; $i < count($this->_cursor["contact"]) ; $i++) {

                if( array_key_exists($target, $this->_cursor["contact"][$i])){
                    if(!$this->_cursor["contact"][$i][$target]["confirmed"]){
                            $resultat["etat"] = "FAIL";
                            $resultat["raison"] = "WAITING";
                    }elseif($this->_cursor["contact"][$i][$target]["confirmed"]){
                        $resultat["etat"] = "FAIL";
                        $resultat["raison"] = "ALREADY_FRIEND";
                    }
                }
            }
        }

        return $resultat;
    }

  /*  public function CancelAddContact($myself, $target){
      //POssible uniquement si _cursor existe
        if(count($this->_cursor["contact"]) != 0){
            for ($i=0; $i < count($this->_cursor["contact"]) ; $i++) {
        }


    }

    /*public function FindInNotificationList($myself){
        $cursor = $this->_collection->findOne(array("idUrl" => $myself));
        $resultat = array();

        if(count($cursor["NotifcationAttente"]) !=0){
            for ($i=0; $i < count($cursor["NotifcationAttente"]); $i++){
                $resultat[$i]=$cursor["NotifcationAttente"][$i];
            }
        }

        return json_encode($cursor);
    }*/

    public function AddNewContact($myself, $target){
        $criteria = array("idUrl" => $myself);
        $newdata = array('$push' => array("contact" => array($target => array( "confirmed" => false))));
        $this->_collection->update($criteria, $newdata);
        
        //Recuperer info target
        $elementMail = array();
        $projection = array("_id"=> false, "nom" => true, "prenom"=> true, "mail" => true, "notificationMail" => true);
       
        $elementMail= $this->FindUserWithHisidUrlANDProjection($target, $projection);
        if($elementMail["notificationMail"] == true)
           echo $elementMail["mail"];
            //envoi mail ici

       //Notifcation 
        $criteria = array("idUrl" => $target);
        $newdata = array('$push' => array("NotificiationAttente" => array($myself => array("ajoutContact" => date("m.d.y g:i:s")))));
        $this->_collection->update($criteria, $newdata);
    }


}
