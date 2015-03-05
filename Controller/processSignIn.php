<?php
/*require_once "userServices.php";
require_once "../Model/UserDB.php";
require_once "../Model/TempUserDB.php";*/

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/UserDB.php";
require_once $root."/Model/TempUserDB.php";
require_once "userServices.php";

if (    isset($_POST["mail"])&&
        isset($_POST["userNom"])&& 
        isset($_POST["userPrenom"])&& 
        isset($_POST["password"]))
{    
	$mail   = htmlentities((string) strtolower($_POST["mail"]));
	$nom    = htmlentities((string) strtolower($_POST["userNom"]));
	$prenom = htmlentities((string) strtolower($_POST["userPrenom"]));	
	$pwd    = (string) $_POST["password"];
    //$classe =  (string) $_POST["classe"];
    
    // CKE : pas de verif sur nom et prenom?
    if (filter_var($mail, FILTER_VALIDATE_EMAIL)) { // Test validité mail
        
        if (strlen($pwd)>= 8) { // Test validité password
            
            // CKE : faire des try/catch?
            $userDbConnection = new UserDbConnection();
            //$cursor = $userDbConnection->_collection->find(array("mail" => $mail));
            $nbMatchingUsers = $userDbConnection->CountInDb($mail); 
            //echo "nb Users = ".$nbMatchingUsers;//. " / cursor count = ".$cursor->count()." ";
            if($nbMatchingUsers == 0) { 
                $tempUserDbConnection = new TempUserDbConnection(); 
                $nbMatchingTempUsers = $tempUserDbConnection->CountInDb($mail);
                //echo "nb TempUsers = ".$nbMatchingTempUsers. " ";
                
                if($nbMatchingTempUsers == 0) {
                    //On inscrit l'utilisateur dans la collection TempUser
                    $date = time(); 
                    $hashedPassword = hashPassword($date, $pwd);
                    $cle = hash('sha256', "efù*zdù*aé'fzaccez".$date.$pwd); 
                    $tempUserDbConnection->InsertTempUser ($date, $mail, $nom, $prenom, $hashedPassword, $cle);
            
                    //On envoie le mail 
		            $sujet   = "Valider votre compte";
                    $entete  = "From : inscription@penless.com";
                    $message = "Bienvenue sur penless le plaisir d'apprendre ! 
                    Cliquez sur le lien suivant pour valider votre compte :
                    http://upylinks.com/Controller/pageActivateUserAccount.php?mail=".urlencode($mail)."&cle=".urldecode($cle)." "; 
                    mail($mail, $sujet, $message, $entete);
                    
                    //echo ("http://localhost/penlessMVC/Controller/pageActivateUserAccount.php?mail=".urlencode($mail)."&cle=".urldecode($cle)."");
                    // CKE DEBUG             
                    echo 'Un mail de validation a été envoyé ';
                }   
                else {
                    echo "IN_PROGRESS";
                }
            
            }
            else {
                echo "DONE"; // L'utilisateur est déjà dans la base des Utilisateurs - compte activé             
            }
        }
        else {
            echo "INVALID_PASSWORD";
        }
    }
    else {
        echo "INVALID_MAIL";
    }
}
else {
    echo "ERROR_POST";
}