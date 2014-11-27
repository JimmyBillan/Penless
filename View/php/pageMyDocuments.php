<?php
session_start();
include('header.php');


/*corp*/
/*Test si on connecté*/


if($_SESSION['id']){
    include('navbarConnected.php');
    
    $d = time();
    echo "<div class='row nomarginright'>";
    include('sidebarConnected.php');
    include('blockMyDocuments.php');
    echo"</div>";
    


    
}else{
       
    include('navbarNotConnected.php');
    //include('html/corpHorsLigne.php'); 
   
}

include('footer.php');
echo  "<script type='text/javascript' src='View/js/pageMyDocuments.js'></script>";