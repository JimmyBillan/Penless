<?php

session_start();

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/UserDB.php";

//if(isset($_GET["U"]) && $_GET["U"] == $_SESSION["id"] ){ TBC CKE
	

	$userDbConnection = new UserDbConnection();
	$projection = array("_id" => false, "contact.accepted" => true);
	$R = $userDbConnection->FindUserWithHisidUrlANDProjection($_SESSION["id"], $projection);

	$arrayRetour = array();

	foreach ($R as $key => $value) {
		foreach ($value as $key2 => $value2) {
			foreach (array_keys($value2) as $idurl ) {
				# code...
				array_push($arrayRetour, $userDbConnection->FindUserWithHisidUrlANDProjection( $idurl, array("_id" => false, "nom" =>true, "prenom" => true, "idUrl" => true)))  ;
				
			}

			# code...
		}
	}
	echo json_encode($arrayRetour);

	
//}