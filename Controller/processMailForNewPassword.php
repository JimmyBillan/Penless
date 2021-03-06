<?php
require_once "../Model/UserDB.php";

if(isset($_POST['mail'])){
    
    // Test si le mail de l'utilisateur est bien dans la DB
    // Si oui, envoie un mail pour réinitialiser le mot de passe
    
	$mail = (string) strtolower($_POST["mail"]); // CKE faut-il tester avant la validité du mail ou pas de risque?

	$userDbConnection = new UserDbConnection();
	$userExists = $userDbConnection->MailExistsInDb($mail);

	if($userExists)
	{ 
		$cle = hash('sha256', 'selmdpchangé***'.$mail.time());
		
        // Envoi le mail
		$sujet = "réinitialisation du mot de passe";
        $entete = "From : password@penless.com";
        $message = "Bonjour,
        Vous venez de faire une demande de réinitialisation de mot de passe
        Cliquez sur le lien pour modifier votre mot de passe
        http://upylinks.com/pageNewPassword.php?mail=".urlencode($mail)."&cle=".urldecode($cle)." "; 
        mail($mail, $sujet, $message, $entete); // CKE debug
     
        // Met à jour la DB avec la cle
    	$userDbConnection->UpdateWithKey($mail, $cle);
    }
    else {
        echo "NOK";
	} 
}