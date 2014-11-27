<?php 
session_start();
include('header.php');
    
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

        include('navbarNotConnected.php');
        include('blockNewPassword.php');
    } 
    else {
        include('pageNotConnected.php');
    }
}

/*corp*/

include('footer.php'); 
echo  "<script type='text/javascript' src='View/js/pageNotConnected.js'></script>";
?>