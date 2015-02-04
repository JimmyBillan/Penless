<?php

session_start();

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/UserDB.php";

if(isset($_GET["U"]) && $_GET["U"] == $_SESSION["id"] ){
	

	$userDbConnection = new UserDbConnection();
	$R = $userDbConnection->getNotification($_SESSION["id"]);

	$values = array();

	
	$projection = array("_id" => false, "nom" =>true, "prenom" => true, "idUrl" => true);
	foreach ($R["notification"] as $key => $value) {
		if($key == "demandeContact")
		{
			
			$urls = array_keys($value);
			for ($i=0; $i < count($urls); $i++) { 
				$values[$urls[$i]] = $userDbConnection->FindUserWithHisidUrlANDProjection($urls[$i], $projection);
			}
			
		}
	}
	$R["values"]=$values;
	echo json_encode($R);
	
}/*else{

	$userDbConnection = new UserDbConnection();
	$R = $userDbConnection->getNotification("DLbpJe8v67");

	$values = array();
	
	$projection = array("_id" => false, "nom" =>true, "prenom" => true, "idUrl" => true);
	foreach ($R["notification"] as $key => $value) {
		# code...
		if($key == "demandeContact")
			$value[key($value)] = $userDbConnection->FindUserWithHisidUrlANDProjection(key($value), $projection);
	}
	var_dump($R);

}*/