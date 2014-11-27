<?php 
session_start();
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/UserDB.php";


if(isset($_POST["U"]) && $_POST["U"] != $_SESSION["id"] ){

	
	$getU = (string) $_POST["U"];

	
	$userDbConnection = new UserDbConnection();
	$resultat = $userDbConnection->FindInContactList($_SESSION["id"], $getU);

	if(count($resultat)==0){
		$resultat = $userDbConnection->AddNewContact($_SESSION["id"], $getU);
	}
/*
	echo json_encode($resultat);
}else{
	
	$userDbConnection = new UserDbConnection();
	$resultat = $userDbConnection->FindInContactList("m4QrZA90vL", "KXR4D2aLNE");
	var_dump($resultat);

	if(!isset($resultat["etat"])){
		$resultat = $userDbConnection->AddNewContact("m4QrZA90vL", "KXR4D2aLNE");
	}
	echo json_encode($resultat);
*/
}
