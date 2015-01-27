<?php 
session_start();
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/UserDB.php";


if(isset($_POST["U"]) && $_POST["U"] != $_SESSION["id"] && isset($_SESSION["id"])){

	
	$getU = (string) $_POST["U"];

	
	$userDbConnection = new UserDbConnection();
	
	$resultat = $userDbConnection->FindInContactList($_SESSION["id"], $getU, "accepted");
	

	if(!$resultat){
		$resultat = $userDbConnection->FindInContactList($_SESSION["id"], $getU, "waiting");
		
		if(!$resultat){
			$resultat = $userDbConnection->FindInContactList($getU, $_SESSION["id"], "waiting");
			
			if(!$resultat){
				$userDbConnection->askNewContact($_SESSION["id"], $getU);
				
			}
				
		}
		
		
	}

	//echo json_encode($resultat);

/*else{
	
	$userDbConnection = new UserDbConnection();
	$resultat = $userDbConnection->FindInContactList("KXR4D2aLNE", "m4QrZA90vL", array("_id" => false,"idUrl" => true));
	var_dump($resultat);

	if(!isset($resultat["idUrl"])){
	$resultat = $userDbConnection->askNewContact("KXR4D2aLNE", "m4QrZA90vL");
	}
	//echo json_encode($resultat);*/

}