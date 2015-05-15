<?php 
session_start();

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Controller/getNumberNotification.php";

function numberNotification(){
	if($_SESSION["id"]){
		$projection = array("_id" => false, "nom" =>true, "prenom" => true, "idUrl" => true, "contact" => true, "notification" => true);
		$u = new UserDbConnection();
		$cursor = $u->getNotification($_SESSION["id"]);

		$count = 0;
		if($cursor["notification"]["demandeContact"])
			$count += count($cursor["notification"]["demandeContact"]);
		
		if($count>0)
			return $count;
	}
}
