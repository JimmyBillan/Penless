<?php
session_start();
if(isset($_POST['D'])){
	$idDOcument = (string) $_POST['D'];

	$resultat = array();

	
	$m = new MongoClient();
	$db = $m->penless;
	$collection = $db-> Document;


	$cursor = $collection->find(array("idDocument" => $idDOcument));

	
	if($cursor->count()==0)
		echo "aucun document à cette url";
	else{

		foreach ($cursor as $key) {
			# code...
			echo $key["nomDocument"]."<br>";
			echo $key["DateModification"];
		}
	}
}
