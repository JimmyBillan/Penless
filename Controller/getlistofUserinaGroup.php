<?php

session_start();

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/GroupDB.php";
require_once $root."/Model/UserDB.php";

if(isset($_GET["id"])){

	$idgroupe = (string) $_GET["id"];
	$groupDbConnection = new groupDbConnection();
	$allowed = TRUE;

	//Verifie si je suis admin du groupe
	$cursor = $groupDbConnection->amIAdmin($_SESSION['id'], $idgroupe);

	if(!$cursor){
		$allowed = FALSE;
		echo json_encode(array('error'=>'dontexist'));
	}
			
		
	if($allowed == TRUE) {
		$projection = array("_id" => false,"admin" => true, "arrayUser" =>true);
		$cursor = $groupDbConnection->listUserInGroup($idgroupe, $projection);

		$userDB = new UserDbConnection();

		for ($i=0; $i < count($cursor['arrayUser']) ; $i++) { 
			$projection = array("_id" => false, "nom" =>true, "prenom" => true, "idUrl" => true);
			$cursor['arrayUser'][$i] = $userDB->FindUserWithHisidUrlANDProjection($cursor['arrayUser'][$i], $projection);
		}

		for ($i=0; $i < count($cursor['admin']) ; $i++) { 
			$projection = array("_id" => false, "nom" =>true, "prenom" => true, "idUrl" => true);
			
			$cursor['admin'][$i] = $userDB->FindUserWithHisidUrlANDProjection($cursor['admin'][$i], $projection);

		}
				
		


		echo json_encode($cursor);
	}
	
	
	
}




