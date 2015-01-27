<?php

session_start();

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/UserDB.php";

if(isset($_POST["U"]) && $_POST["U"] != $_SESSION["id"] && isset($_SESSION["id"])){
	$getU = (string) $_POST["U"];
	$userDbConnection = new UserDbConnection();
	$userDbConnection->removeNotificationDemandeContact($_SESSION["id"], $getU);
	$userDbConnection->removeWaitingContact($getU, $_SESSION["id"]);
	echo "ok";

}