<?php

session_start();

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/UserDB.php";

if(isset($_POST["docResult"]) {
	

	$userDbConnection = new userDbConnection();
	//$projection = array("_id" => false, "nom" => true);
	$cursor = $userDbConnection->getGroupe($_SESSION["id"], array("_id"=>false, "nom" => true, "idGroupe" => true));
	$cursor->sort(array('date' => -1));
	$arrayRetour = array();
	foreach ($cursor as $doc) {
            array_push($arrayRetour,$doc) ;
        }
     
     echo json_encode($arrayRetour);
	//echo json_encode($arrayRetour);

	
//}