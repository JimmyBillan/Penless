<?php

session_start();

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/UserDB.php";

if(isset($_POST["C"]) && isset($_SESSION["id"])){
	$getC = (string) $_POST["C"];
	$resultat = array();

	$userDbConnection = new UserDbConnection();

	$projection = array("_id" => false, "NotificiationAttente" =>true);
	$resultat = $userDbConnection->FindUserWithHisidUrlANDProjection($_SESSION["id"], $projection);
	$c = count($resultat["NotificiationAttente"]);
	$projection = array("_id" => false, "nom" =>true, "prenom" => true);
	$retour = array();
	for ($i=0; $i < $c ; $i++) { 
		$retour[$i] = $userDbConnection->FindUserWithHisidUrlANDProjection(key($resultat["NotificiationAttente"][$i]), $projection);
		
	}
	//echo json_encode($resultat["NotificiationAttente"][0]);
	
	echo  json_encode($retour);
}