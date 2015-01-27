<?php 
session_start();
include('View/php/header.php');
    
/*corp*/
/*Test si on connecté*/

if($_SESSION['id']){
    include('pageConnected.php');    
    /*include('navbarConnected.php');
    echo "<div class='row'>";
    include('sidebarConnected.php');
    echo"</div>"; // CKE 
    echo ('<meta http-equiv="refresh" content="2;url=/../index.php">');*/
    
}else{
    
    if(isset($_GET['mail']) && isset($_GET['cle'])){

	    $mail = (string) $_GET['mail'];
		$cle = (string) $_GET['cle'];

        include('View/php/navbarNotConnected.php');
        include('View/php/blockNewPassword.php');
    } 
    else {
        include('View/php/pageNotConnected.php');
    }
}

/*corp*/

include('View/php/footer.php');
echo  "<script type='text/javascript' src='View/js/pageNotConnected.js'></script>";
?>