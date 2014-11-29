<?php
session_start();

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/UserDB.php";

if(isset($_POST["U"])&& $_POST["U"] != $_SESSION["id"]){
	
	$getU = (string) $_POST["U"];
	$resultat = array();

	$projection = array("_id" => false, "nom" =>true, "prenom" => true, "idUrl" => true, "contact" => true, "notification" => true);
	$userDbConnection = new UserDbConnection();
	$cursor = $userDbConnection->FindUserWithHisidUrlANDProjection($getU, $projection);

	if($cursor == null)
		$resultat ["isAmi"] ="No_user";
	else{
		$resultat["nom"] = $cursor["nom"];
		$resultat["prenom"] = $cursor["prenom"];
		
		if(array_key_exists($_SESSION["id"], $cursor["notification"]["demandeContact"]))
			$resultat["isAmi"] = "WAITING";
		elseif(array_key_exists($_SESSION["id"], $cursor["contact"]["accepted"]))
			$resultat["isAmi"] = "ALREADY_FRIEND";
		elseif(array_key_exists($_SESSION["id"], $cursor["contact"]["waiting"]))
			$resultat["isAmi"] = "WAITING_FOR_ME";
		else
			$resultat["isAmi"] = "";
	
	}
	
	echo json_encode($resultat);

}elseif(isset($_POST["U"]) == $_SESSION["id"]) {
	# code...

	$projection = array("_id" => false, "nom" =>true, "prenom" => true, "idUrl" => true, "contact" => true );
	$userDbConnection = new UserDbConnection();
	$cursor = $userDbConnection->FindUserWithHisidUrlANDProjection($_SESSION["id"], $projection);


	$resultat = array();
	$temp = array();

	$resultat["nom"] = $cursor["nom"];
	$resultat["prenom"] = $cursor["prenom"];
	$resultat["isAmi"] = "MYSELF";
	echo json_encode($resultat);
}/*else{

	$getU = "KXR4D2aLNE";
	$resultat = array();

	$projection = array("_id" => false, "nom" =>true, "prenom" => true, "idUrl" => true, "contact" => true);
	$userDbConnection = new UserDbConnection();
	$cursor = $userDbConnection->FindUserWithHisidUrlANDProjection($getU, $projection);

	if($cursor == null)
			echo "aucun utilisateur à cette url";
	else{
		$resultat["nom"] = $cursor["nom"];
		$resultat["prenom"] = $cursor["prenom"];
			
		if(in_array($key["contact"], $_SESSION['id']))
			$resultat["contact"] = true;
		else
			$resultat["contact"] = false;
	
	}
	
	echo json_encode($resultat);
}*/
