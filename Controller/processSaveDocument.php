<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/DocumentDB.php";
require_once "Hashids.php";
session_start();

if(isset($_POST['document']))
{
		
		$doc = $_POST['document'];
		var_dump($doc);
		$doc["createur"] = $_SESSION['id'];
		$doc["idDocument"] = $_SESSION['idDocument'];
		$doc["DateModification"] = date("m.d.y g:i:s");
		
		$c = new DocumentDBconnection();
		$documentSaved = $c->findOne($_SESSION['idDocument']);
		var_dump($documentSaved);

		

		
		
		$c = new DocumentDBconnection();
        $c->Update ($_SESSION['idDocument'], $doc);
    	//echo "success [msg temp processsSaveDocument.php]";
		//var_dump($resultat);

}