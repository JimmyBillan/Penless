<?php

class DocumentDbConnection {
	var $_m;
	var $_db;
	var $_collection;

	public function __construct()
	{
		$this->_m          = new MongoClient();
		$this->_db         = $this->_m->penless;
		$this->_collection = $this->_db->Document;
	}

    public function FindOne($idDocument)
	{
		return $this->_collection->findOne(array("idDocument" => $idDocument));		
	}
    
    public function Find($idCreateur)
	{
	return $this->_collection->find(array("createur" => $idCreateur));
		
	}

	public function Update($idDocument, $doc)
	{
		$criteria = array("createur" => $doc["createur"], "idDocument" => $idDocument);
		$options = array("upsert"=>true);
        $this->_collection->update($criteria, $doc, $options);
	}

	public function findAndDelete($idDocument, $createur)
	{
		$criteria = array("createur" => $createur, "idDocument" => $idDocument);
		$this->_collection->remove($criteria);
		echo "delete_success";

	}
}
