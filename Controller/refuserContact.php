<?php

session_start();

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/UserDB.php";

if(isset($_POST["U"]) && $_POST["U"] != $_SESSION["id"] ){
	$userDbConnection = new UserDbConnection();
}