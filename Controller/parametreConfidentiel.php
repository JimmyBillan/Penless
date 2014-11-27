<?php
session_start();
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/UserDB.php";

if(isset($_POST["U"]) == $_SESSION["id"]){

	$projection = array("_id" => false, "nom" =>true, "prenom" => true, "idUrl" => true,"notificationMail" => true);
	$userDbConnection = new UserDbConnection();
	$cursor = $userDbConnection->FindUserWithHisidUrlANDProjection($_SESSION["id"], $projection);

	
	echo json_encode($cursor);
}