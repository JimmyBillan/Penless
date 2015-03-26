<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/ContactDB.php";
require_once $root."/Model/DocumentDB.php";

session_start();
if(isset($_POST['category'])){

	$category = (string) $_POST['category']; // debug with : "Français";//
	
	$docDb = new DocumentDbConnection();
	
	if (isset($_SESSION["id"])){
		$userId = $_SESSION["id"]; // debug with : "N6vpo999Aa";//

		// Utilise les groupes auxquels appartient l'utilisateur
		$groupDB = new GroupDbConnection();
		$groups  = $groupDB->getAllGroupIdArray($userId);
		
		$docCursor = $docDb->findReadableDocWithCategory($category, $userId, $groups);
	} 
	else {
		// Hors connection, l'utilisateur ne peut accéder qu'aux documents publics
		$docCursor = $docDb->findPublicDocWithCategory($category);
	}

	echo json_encode(iterator_to_array($docCursor));		
}
