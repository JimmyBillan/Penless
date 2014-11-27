<?php 
session_start();

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/UserDB.php";

if(isset($_POST["U"])&& $_POST["U"] != $_SESSION["id"]){
	$getU = (string) $_POST["U"];

	$c = new UserDbConnection();
	$cursor = $c->FindInContactList($_SESSION["id"], $getU);

	if($cursor["raison"] == "WAITING"){
		
	}
	var_dump($cursor);
}