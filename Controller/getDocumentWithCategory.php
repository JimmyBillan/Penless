<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/DocumentDB.php";

session_start();
if(isset($_POST['category'])){
	$category = (string) $_POST['category'];
	
	$m = new DocumentDbConnection();
	
	// CKE : Ou faire le test sur le nombre de résultats et sur le partage?
	$cursor = $m->findWithCategory($category); // ici?
	
	$cursor->limit(10); // là?

	$arrayRetour = array();
	
	
		foreach ($cursor as $key) {
			if($key["confident"] == "public"){// là?
				array_push($arrayRetour, $key);
			}
		}
		echo json_encode($arrayRetour);
	
		
}