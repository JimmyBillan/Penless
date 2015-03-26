<?php 

session_start();
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/ContactDB.php";
require_once $root."/Model/UserDB.php";

if(isset($_POST['idGroup']) && $_SESSION["id"])
{
	$db = new groupDbConnection();
	$cursor = $db->deleteGroup($_SESSION["id"], (string) $_POST['idGroup']);

}
