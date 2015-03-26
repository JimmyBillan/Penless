<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/ContactDB.php";
require_once $root."/Model/DocumentDB.php";

session_start();

if(isset($_POST["D"])){
	$docId = (string) $_POST["D"];
	$docDB = new DocumentDbConnection();

	if (isset($_SESSION["id"])) { 
		// Utilisateur connecté
		// Utilise les groupes de l'utilisateur pour tester la visibilité du document
		$groupDB = new GroupDbConnection();
		$userGroups = $groupDB->getAllGroupIdArray($_SESSION["id"]);
		$doc = $docDB->findReadableOne($docId, $_SESSION["id"], $userGroups);
	} else {
		$doc = $docDB->findPublicOne($docId);
	}

	if ($doc == null) {echo "aucun document à cette url";}
	else {echo json_encode($doc);}	
}
