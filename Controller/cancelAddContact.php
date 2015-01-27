<?php 
session_start();
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/UserDB.php";


if(isset($_POST["U"]) && $_POST["U"] != $_SESSION["id"] && isset($_SESSION["id"])){

	$getU = (string) $_POST["U"];
	$userDbConnection = new UserDbConnection();

	$resultat = $userDbConnection->FindInContactList($_SESSION["id"], $getU, "waiting");
	if($resultat){
		$userDbConnection->removeWaitingContact($_SESSION["id"], $getU);
		$userDbConnection->removeNotificationDemandeContact($getU, $_SESSION["id"]);
		echo $getU;
	}
}