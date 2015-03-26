<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/DocumentDB.php";
require_once $root."/Model/ContactDB.php";

session_start();
if(isset($_POST['tags'])){
	$tagString = (string) $_POST['tags'];
	$tags = explode (" ", $tagString);
	//$_SESSION["id"] = "N6vpo999Aa";
	//$tags = ["manger"];
	
	$docDb = new DocumentDbConnection();
	
	if (isset($_SESSION["id"])){
		$userId = $_SESSION["id"]; // debug with : "N6vpo999Aa";//

		// Utilise les groupes auxquels appartient l'utilisateur
		$groupDB = new GroupDbConnection();
		$groups  = $groupDB->getAllGroupIdArray($userId);
		
		$docCursor = $docDb->findReadableDocWithTags($tags, $userId, $groups);
	} 
	else {
		// Hors connection, l'utilisateur ne peut accéder qu'aux documents publics
		$docCursor = $docDb->findPublicDocWithTags($tags);
	}

	echo json_encode(iterator_to_array($docCursor));		
}