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
		$projection = array("_id" => false);// prendre id, Nom, Date, Auteur, Note mais pas contenu??? CKE
		return $this->_collection->findOne(array("idDocument" => $idDocument), $projection );		
	}
    
	public function findWithCategory($category)
	{
		$projection = array("_id" => false, 
			"titreDocument"    => true,
			"idDocument"       => true, 
			"createur"         => true, 
			"confident"        => true, 
			"DateModification" => true, 
			"categorie"        => true);
		return $this->_collection->find(array("categorie" => $category), $projection);	
	}

	public function findWithTags($tags)
	{
		$projection = array("_id" => false, 
			"titreDocument"    => true,
			"idDocument"       => true, 
			"createur"         => true, 
			"confident"        => true, 
			"DateModification" => true, 
			"categorie"        => true);
		
		return $this->_collection->find(array("tags" => array('$all' => $tags)), $projection);
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
