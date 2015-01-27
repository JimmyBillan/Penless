<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/DocumentDB.php";
require_once "Hashids.php";
session_start();

if(isset($_POST['idDocument']))
{
		
		$doc = (string) $_POST['idDocument'];
	
		
		$c = new DocumentDBconnection();
		$documentSaved = $c->findAndDelete($_SESSION['idDocument'], $_SESSION['id']);
		echo "ok";

}