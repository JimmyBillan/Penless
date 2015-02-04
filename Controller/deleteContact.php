<?php 

session_start();
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/UserDB.php";

if(isset($_POST["U"]) && $_SESSION["id"]){
	$userDbConnection = new UserDbConnection();

	$result = $userDbConnection->removeContact($_SESSION["id"], (string) $_POST["U"]);
	var_dump($result);

}