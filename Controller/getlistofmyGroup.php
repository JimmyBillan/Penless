<?php

session_start();

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/ContactDB.php";

if(isset($_GET["U"]) && $_GET["U"] == $_SESSION["id"] ){
	

	$groupDbConnection = new groupDbConnection();
	//$projection = array("_id" => false, "nom" => true);
	$cursor = $groupDbConnection->getGroupe($_SESSION["id"], array("_id"=>false, "nom" => true, "idGroupe" => true));
	$cursor->sort(array('date' => -1));
	$arrayRetour = array();
	foreach ($cursor as $doc) {
            array_push($arrayRetour,$doc) ;
        }
     
     echo json_encode($arrayRetour);
	//echo json_encode($arrayRetour);

	
}