<?php

session_start();

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/ContactDB.php";

if(isset($_GET["id"])){

	$idgroupe = (string) $_GET["id"];
	$groupDbConnection = new groupDbConnection();
	$allowed = TRUE;

	//Verifie si je suis admin du groupe
	$cursor = $groupDbConnection->amIAdmin($_SESSION['id'], $idgroupe);
	
	//Si je fais bien partie du groupe 
	$cursor = $groupDbConnection->isInGroup($_SESSION['id'], $idgroupe);
	if(!cursor){
		$allowed = FALSE;
		echo json_encode(array('error'=>'dontexist'));
	}
			
		
	if($allowed == TRUE) {
		$projection = array("_id" => false,"admin" => true, "arrayUser" =>true);
		$cursor = $groupDbConnection->listUserInGroup($idgroupe, $projection);
		echo json_encode($cursor);
	}
	
	
	
}




