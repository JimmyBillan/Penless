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

    public function findPublicOne($idDocument)
	{
		$projection = array("_id" => false);// prendre id, Nom, Date, Auteur, Note mais pas contenu??? CKE
		return $this->_collection->findOne(array("idDocument" => $idDocument,
												 "confident"  => "Public"),
										   $projection );		
	}

	public function findMyOne($idDocument, $idUser)
	{
		$projection = array("_id" => false);
		$query = array("idDocument" => $idDocument, 
					   "createur"   => $idUser);
		return $this->_collection->findOne($query, $projection);
	}

	public function findReadableOne($idDocument, $idUser, $idGroups)
	{
		$projection = array("_id" => false);
		$query = array("idDocument" => $idDocument, 
						// AND is implicit
				  		'$or'       => array(array("confident" => "Public"),
									   		array("createur" => $idUser),
									   		array("sharingContacts" => array('$in' => array($idUser))), 
									   		array("sharingGroups"   => array('$in' => $idGroups))
										)
				  		);
		return $this->_collection->findOne($query, $projection);
	}
    
    public function findReadableDocFromCreateur($duo)
	{
		$projection = array("_id" => false, 
			"titreDocument"    => true,
			"idDocument"       => true, 
			"createur"         => true, 
			"DateModification" => true, 
			"categorie"        => true);
        
		$query = array(	"createur" => $duo["createur"], 
						// AND is implicit
				  		'$or'       => array(array("confident" => "Public"),
									   		array("sharingContacts" => array('$in' => array($duo["user"]))), 
									   		array("sharingGroups"   => array('$in' => $duo["userGroups"]))
									)
				  		);

		return $this->_collection->find($query, $projection);	
	}

	public function findPublicDocWithCategory($category)
	{
		$projection = array("_id" => false, 
			"titreDocument"    => true,
			"idDocument"       => true, 
			"createur"         => true, 
			"DateModification" => true, 
			"categorie"        => true);
		return $this->_collection->find(array("categorie" => $category, 
											  "confident" =>"Public"),
										$projection);	
	}

	/*public function findGroupSharedDocWithCategory($category, $idGroups)
	{
		$projection = array("_id" => false, 
			"titreDocument"    => true,
			"idDocument"       => true, 
			"createur"         => true, 
			"DateModification" => true, 
			"categorie"        => true);
		//Mongo : db.Document.find({"sharingGroups":{$in:["PLQRanq6Ax", "xxxxxx"]}})
		return $this->_collection->find(array("categorie"     => $category, 
											  "sharingGroups" => array('$in' => $idGroups)),
										$projection);	
	}

	public function findContactSharedDocWithCategory($category, $idUser)
	{
		$projection = array("_id" => false, 
			"titreDocument"    => true,
			"idDocument"       => true, 
			"createur"         => true, 
			"DateModification" => true, 
			"categorie"        => true);
		
		return $this->_collection->find(array("categorie"     => $category, 
											  "sharingContacts" => array('$in' => array($idUser))),
										$projection);	
	}*/

	public function findReadableDocWithCategory($category, $idUser, $idGroups)
	{
		$projection = array("_id" => false, 
			"titreDocument"    => true,
			"idDocument"       => true, 
			"createur"         => true, 
			"DateModification" => true, 
			"categorie"        => true);
        
		/*return $this->_collection->find(
			array('$and' => array(array("categorie"     => $category),
								  array('$or' => array(array("confident" => "Public"),
										   				array("createur" => $idUser),
										   				array("sharingContacts" => array('$in' => array($idUser))), 
										   				array("sharingGroups"   => array('$in' => $idGroups))
										   				)))),
			$projection);*/	
		$query = array(	"categorie" => $category, 
						// AND is implicit
				  		'$or'       => array(array("confident" => "Public"),
									   		array("createur" => $idUser),
									   		array("sharingContacts" => array('$in' => array($idUser))), 
									   		array("sharingGroups"   => array('$in' => $idGroups))
									)
				  		);

		return $this->_collection->find($query, $projection);	
	}

	public function findPublicDocWithTags($tags)
	{
		$projection = array("_id" => false, 
			"titreDocument"    => true,
			"idDocument"       => true, 
			"createur"         => true, 
			"DateModification" => true, 
			"categorie"        => true);
		return $this->_collection->find(array("tags"      => array('$all' => $tags), 
											  "confident" =>"Public"),
										$projection);	
	}

	public function findReadableDocWithTags($tags, $idUser, $idGroups)
	{
		$projection = array("_id" => false, 
			"titreDocument"    => true,
			"idDocument"       => true, 
			"createur"         => true, 
			"confident"        => true, 
			"DateModification" => true, 
			"categorie"        => true);
		
		$query = array(	"tags" => array('$all' => $tags), 
						// AND is implicit
				  		'$or'       => array(array("confident" => "Public"),
									   		array("createur" => $idUser),
									   		array("sharingContacts" => array('$in' => array($idUser))), 
									   		array("sharingGroups"   => array('$in' => $idGroups))
									)
				  		);
		return $this->_collection->find($query, $projection);
		/*return $this->_collection->find(array("tags" => array('$all' => $tags),
				  '$or'       => array(array("confident" => "Public"),
									   array("createur" => $idUser),
									   array("sharingContacts" => array('$in' => array($idUser))), 
									   array("sharingGroups"   => array('$in' => $idGroups))
									))), $projection);*/
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
