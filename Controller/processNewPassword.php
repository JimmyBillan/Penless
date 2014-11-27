<?php
require_once "../Model/UserDB.php";

if (isset($_POST['mail']) && isset($_POST['cle']) && isset($_POST['password'])){
	$mail = (string) strtolower($_POST['mail']);
	$cle = (string) $_POST['cle'];
	$pwd = (string) $_POST['password'];

    // Verification des champs et mise à jour DB
	if (filter_var($mail, FILTER_VALIDATE_EMAIL)) {
        
        if (strlen($pwd)>= 8) {
            // CKE La vérification de l'existence du mail dans la DB est faite au niveau de pageNewPassword.php
            $userDbConnection = new UserDbConnection();
            $userIsInDB = $userDbConnection->MailAndKeyExistInDb($mail, $cle); 
            //echo " userIsInDB ".$mail." ".$cle." => ".$userIsInDB." ";
            if ($userIsInDB) {
                $date = time();
                $userDbConnection->UpdateWithPassword($mail, $cle, $pwd, $date);
		
                echo "OK";
            } 
            else {
                echo "UNKNOWN_MAIL";
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
    echo "POST_ERROR";
}
