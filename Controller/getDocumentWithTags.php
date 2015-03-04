<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/DocumentDB.php";

session_start();
if(isset($_POST['tags'])){
	
	$tagString = (string) $_POST['tags'];
	$tags = explode (" ", $tagString);
	
	$m = new DocumentDbConnection();
	
	// CKE : Ou faire le test sur le nombre de résultats et sur le partage?
	$cursor = $m->findWithTags($tags); // ici?
	
	$cursor->limit(10); // là?

	$arrayRetour = iterator_to_array($cursor);
	
	echo json_encode($arrayRetour);
		
}