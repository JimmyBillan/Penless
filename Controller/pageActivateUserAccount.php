<?php 
include('header2.php');
require_once "../Model/UserDB.php";
require_once "../Model/TempUserDB.php";
require_once "Hashids.php";

if (isset($_GET['mail']) && isset($_GET['cle'])){
	
	$mail = (string) $_GET['mail'];
	$cle = (string) $_GET['cle'];

	$tempUserDbConnection = new TempUserDbConnection();

	$tempUser = $tempUserDbConnection->FindOne($mail, $cle);
	
	if ($tempUser == null){//($cursor-> count() == 0){
		echo "erreur";
		echo ('<meta http-equiv="refresh" content="2;url=../index.php">');
	}else{
		// Insert User in User Database
		$userDbConnection = new UserDBconnection();
        
        $hashids = new Hashids("Penlesssalée"); 
        
        $userDbConnection->InsertUser (
            $hashids->encode(microtime(true) * 10000), 
            $tempUser['mail'],
            $tempUser['nom'], 
            $tempUser['prenom'],
            $tempUser['dateInscription'],
            $tempUser['dateModificationPassword'],
            $tempUser['password']); 
        
        //$id = $userDbConnection->GetUserId($tempUser['mail']);
        
        // Remove User from TempUser Database
		$tempUserDbConnection->remove($mail);
        
		echo "Inscription reussie, bienvenue sur Penless! Vous allez être redirigé dans quelques secondes";
		echo ('<meta http-equiv="refresh" content="2;url=../View/php/index.php">');
	}	
} 
include('footer2.php');
?>