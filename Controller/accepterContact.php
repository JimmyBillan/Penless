<?php

session_start();

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/UserDB.php";

if(isset($_POST["U"]) && $_POST["U"] != $_SESSION["id"] && isset($_SESSION["id"])){
	$U = (string) $_POST["U"];
	$userDbConnection = new UserDbConnection();
	$result = $userDbConnection->FindNotificationDemandeContact($_SESSION["id"],$U);
	
	if($result){
		$userDbConnection->addContact($_SESSION["id"], $U);
		$userDbConnection->addContact($U, $_SESSION["id"]);
		$userDbConnection->removeNotificationDemandeContact($_SESSION["id"], $U);
		$userDbConnection->removeWaitingContact($U, $_SESSION["id"]);
		echo "ok";
	}

}/*else{
	$userDbConnection = new UserDbConnection();
	$result = $userDbConnection->FindNotificationDemandeContact('DLbpJe8v67',"m4QrZA90vL");

	if($result){
		$userDbConnection->addContact('DLbpJe8v67', "m4QrZA90vL");
		$userDbConnection->addContact("m4QrZA90vL", 'DLbpJe8v67');
		$userDbConnection->removeNotificationDemandeContact('DLbpJe8v67', "m4QrZA90vL");
		$userDbConnection->removeWaitingContact("m4QrZA90vL", 'DLbpJe8v67');
	}
}*/