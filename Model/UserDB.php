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

     public function isUserExist($idUrl){
        $cursor = $this->_collection->find(array('idUrl'=> $idUrl));
        return ($cursor->count() > 0);
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
                                         //"contact"                  => array(),
                                         "notificationMail"         => true//,
                                         //"notificiation"            => array()
                                         ));
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

    public function FindInContactList($myself, $target, $type){
       return $this->_collection->findOne(array('$and' => array( array("idUrl" => $myself), array("contact.$type.$target" => array('$exists' => true)) )),  array("_id" => false, "idUrl" =>true) );
  
    }


    public function FindNotificationDemandeContact($myself, $target){
       return $this->_collection->findOne(array('$and' => array( array("idUrl" => $myself), array("notification.demandeContact.$target" => array('$exists' => true)) )),  array("_id" => false, "idUrl" =>true) );
    }

  /*  public function CancelAskContact($myself, $target){
      //POssible uniquement si _cursor existe
        if(count($this->_cursor["contact"]) != 0){
            for ($i=0; $i < count($this->_cursor["contact"]) ; $i++) {
        }


    }
*/
    public function getNotification($myself){
        return $this->_collection->findOne(array("idUrl" => $myself), array("_id" => false, "notification" =>true));
    }

    public function askNewContact($myself, $target){
        
        $criteria = array("idUrl" => $myself);
        $newdata = array('$set' => array("contact.waiting.$target" => date("m.d.y g:i:s")));
        $this->_collection->update($criteria, $newdata, array("upsert" => true));
        
        //Recuperer info target
       $this->NotifyUser($target, $myself, "askNewContact");
       echo $target;
        
    }

    public function addContact($myself, $target){
        $criteria = array("idUrl" => $myself);
        $newdata = array('$set' => array("contact.accepted.$target" => date("m.d.y g:i:s")) );
        $this->_collection->update($criteria,$newdata, array("upsert" => true));
    }

    public function removeContact($myself, $target){
        $this->_collection->update(array("idUrl" => $myself), array('$unset' => array("contact.accepted.$target"=> 1)));
        $this->_collection->update(array("idUrl" => $target), array('$unset' => array("contact.accepted.$myself"=> 1)));
    }

    public function removeNotificationDemandeContact($myself, $target){
        $criteria = array("idUrl" => $myself);
        $this->_collection->update($criteria, array('$unset' => array("notification.demandeContact.$target" => true)));
    }

    public function removeWaitingContact($myself, $target){
        $criteria = array("idUrl" => $myself);
        $this->_collection->update($criteria, array('$unset' => array("contact.waiting.$target" => true )));
    }

    public function NotifyUser($user, $myself, $type){

        if($type == "askNewContact"){
            $projection = array("_id"=> false, "nom" => true, "prenom"=> true, "mail" => true, "notificationMail" => true);
            $elementMail= $this->FindUserWithHisidUrlANDProjection($user, $projection);
            
           // if($elementMail["notificationMail"] == true)
                    //echo $user;

            $criteria = array("idUrl" => $user);
            $newdata = array('$set' => array("notification.demandeContact.$myself"=>date("m.d.y g:i:s")));
            $this->_collection->update($criteria, $newdata, array("upsert" => true));

          //  $newdata = array('$inc' => array("countNotification" => +1), array("upsert" => true));
            //$this->_collection->update($criteria, $newdata);
        }
    
    }


}
