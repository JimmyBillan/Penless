<?php

class TempUserDbConnection {
	var $_m;
	var $_db;
	var $_collection;

	public function __construct()
	{
		$this->_m          = new MongoClient();
		$this->_db         = $this->_m->penless;
		$this->_collection = $this->_db->TempUser;
	}

    public function CountInDb($mail)
	{
		$cursor = $this->_collection->find(array("mail" => $mail));
		return ($cursor->count());		
	}
    
    public function FindOne($mail, $cle)
    {
	    return $this->_collection->findOne(array("mail" => $mail, "cle" => $cle));
    }
    
	public function InsertTempUser($date, $mail, $nom, $prenom, $hashedPassword, $cle)
	{
		$this->_collection->insert(array("mail"                     => $mail,
                                         "nom"                      => $nom,
                                         "prenom"                   => $prenom,
                                         "dateInscription"          => $date,
                                         "dateModificationPassword" => $date,
                                         "password"                 => $hashedPassword,
                                         "cle"                      => $cle));
    }
                                   
    public function Remove($mail)
    {
        $this->_collection->remove(array("mail" => $mail));
    }

}
