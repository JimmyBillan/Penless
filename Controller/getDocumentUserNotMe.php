<?php

session_start();
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/DocumentDB.php";
require_once $root."/Model/GroupDB.php";


if(isset($_GET["U"]) && isset($_SESSION["id"])) {

	$docDb = new DocumentDbConnection();
	$user = $_SESSION["id"]; //"m4QrZA90vL";//

	// Utilise les groupes auxquels appartient l'utilisateur
	$groupDB = new GroupDbConnection();
	$groups  = $groupDB->getAllGroupIdArray($user);
	$docCursor = array();

	// Pour utiliser la fonction findReadableDocFromCreateur
	// Prend soit en parametre un utilisateur soit une liste
	
	// On test si on a une liste d'utilisateur ou un seul
	if(gettype($_GET["U"]) == "array"){
	
		$duo["user"]     = $user;
		$duo["userGroups"] = $groups;
		
		if($_GET["area"] == "accueil"){
			foreach ($_GET["U"] as $key) {
				$duo["createur"] = (string) $key;
				array_push($docCursor,  $docDb->findReadableDocFromCreateur($duo)->sort(array('DateModification' => -1))->limit(10)) ;
			}
		}else{
			foreach ($_GET["U"] as $key) {
				$duo["createur"] = (string) $key;
				array_push($docCursor,  $docDb->findReadableDocFromCreateur($duo)) ;
			}
		}

		

		$arrayRetour = array();
		foreach ($docCursor as $keyCursor) {
			if($keyCursor->count()>0){
				foreach ($keyCursor as $key) {
					array_push($arrayRetour, $key);
				}
			}
		}

		echo json_encode($arrayRetour);
		
		
	}else{
		$duo["createur"] = (string)($_GET["U"]);

		$duo["user"]     = $user;
		$duo["userGroups"] = $groups;
		$docCursor = $docDb->findReadableDocFromCreateur($duo);
		$docCursor->sort(array('DateModification' => -1));

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



	
	

}