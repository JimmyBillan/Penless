<?php

session_start();
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/UserDB.php";
require_once $root."/Model/DocumentDB.php";

if(isset($_POST["U"]) && $_POST["U"] != $_SESSION["id"]){

	$db = new DocumentDbConnection();
	$user = (string) $_POST["U"];

	$m = new MongoClient();
	$db = $m->penless;
	$collection = $db-> Document;

	$projection = array("_id" => false, "nomDocument" => true,"idDocument" => true, "createur" => true, "confident" => true, "DateModification" => true);
	$cursor = $collection->find(array("createur" => $user), $projection);

	$arrayRetour = array();
	if($cursor->count()==0)
		echo "no_document";	
	else{
		foreach ($cursor as $key) {
				if($key["confident"] != "privee"){
					array_push($arrayRetour, $key);

				}
					
		}
		
	}
	if(count($arrayRetour) == 0 )
		echo "no_document";
	else
		echo json_encode($arrayRetour);



}