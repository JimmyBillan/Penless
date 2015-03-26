<?php

session_start();
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/DocumentDB.php";
require_once $root."/Model/ContactDB.php";

if(isset($_GET["U"]) && isset($_SESSION["id"])) {

	$docDb = new DocumentDbConnection();
	$user = $_SESSION["id"]; //"m4QrZA90vL";//

	// Utilise les groupes auxquels appartient l'utilisateur
	$groupDB = new GroupDbConnection();
	$groups  = $groupDB->getAllGroupIdArray($user);
	
	$duo["createur"] = (string)($_GET["U"]); //"N6vpo999Aa";
	$duo["user"]     = $user;
	$duo["userGroups"] = $groups;
	$docCursor = $docDb->findReadableDocFromCreateur($duo);
	
	$arrayRetour = array();
	if($docCursor->count()==0)
		echo "no_document";	
	else {
		foreach ($docCursor as $key) {
			array_push($arrayRetour, $key);
		}
		echo json_encode($arrayRetour);
	}
}