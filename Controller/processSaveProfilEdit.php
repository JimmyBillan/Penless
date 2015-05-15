<?php
session_start();
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/UserDB.php";


if(isset($_POST["inputs"]) &&$_SESSION["id"]){

	$fieldsOk = true;

	// Verifie qu'aucune des valeurs n'est vide
	foreach ($_POST["inputs"] as $key => $value) {
		if(trim($value) == ""){
			echo json_encode(array("error" => $key." est vide"));
			$fieldsOk = false;
		}
	}

	if($fieldsOk){
		$CB_mail = false;
		
		if($_POST["inputs"]["CB_mail"] == "true"){
			$CB_mail = true;
		}
		$data = array("nom" => trim(strtolower( $_POST["inputs"]["nom"])),"prenom" => trim(strtolower((string)$_POST["inputs"]["prenom"])),"notificationMail" => $CB_mail);
		
		$u = new UserDbConnection();
		$u->UpdateInfoConfidentiel($_SESSION["id"], $data);
	}

}