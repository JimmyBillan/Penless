<?php 

session_start();
$root = realpath($_SERVER["DOCUMENT_ROOT"]);

require_once $root."/Model/GroupDB.php";


if(isset($_POST["G"]) && $_SESSION["id"]){
	
	$gName = htmlentities((string) $_POST["G"]);	

	$contactDB = new groupDbConnection();
	$arrayAdmin = array($_SESSION["id"]);

	$contactDB->initGroup($gName, microtime(true), $arrayAdmin);
}