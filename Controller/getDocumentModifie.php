<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/DocumentDB.php";

session_start();
if(isset($_POST['D'])){
	$idDOcument = (string) $_POST['D'];
	
	// Test si le document appartient bien à l'utilisateur
	$m = new DocumentDbConnection();
	
	$doc = $m->FindOne($idDOcument);
	
	if ($doc['createur'] == null) {
		echo "INVALID_DOCUMENT";}
	else if ($doc['createur'] != $_SESSION['id']) {
		echo "UNAUTHORIZED_USER";}
	else {
		
		$_SESSION['idDocument'] = $idDOcument;
		
		echo json_encode($doc);
	}
}
