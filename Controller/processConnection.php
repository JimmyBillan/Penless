<?php 
require_once "../Model/UserDB.php";

if (isset($_POST['mail']) && isset($_POST['password'])) {
	
	$mail =  (string) strtolower($_POST["mail"]);
	$pwd  =  (string)$_POST["password"];
	
    /* TEMPORAIRE POUR ACCEDER AU MODE EN LIGNE POUR VOIR L'INTERFACE 
    session_start();
    $_SESSION['id']=1;
    echo "1";
    /* TEMPORAIRE POUR ACCEDER AU MODE EN LIGNE POUR VOIR L'INTERFACE */
    
	$userDbConnection = new UserDBconnection();
    
	$id = $userDbConnection->GetUserId($mail, $pwd);
	
	if ($id == "UNKNOWN_MAIL"){
		echo "UNKNOWN_MAIL";
        
	}
    elseif($id == "WRONG_PASSWORD"){
        echo "WRONG_PASSWORD";
        
	}
    else{
        /*Mail et Pwd corrects CONNECTION*/
        session_start();

        $dateCreationToken = time(TRUE);  
        $token = hash('sha256', $id.$dateCreationToken."hashdutoken***");

        //$userDbConnection->UpdateWithToken($id, $token);
        // Add tokensessionDB?
        
		$_SESSION['id'] = $id;
		//$_SESSION['token'] = $token;
		echo 'CONNECTION';
    }	
}
else{
	echo "POST_ERROR";
}


        