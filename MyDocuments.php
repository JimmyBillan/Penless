<?php
session_start();
include('View/php/header.php');


/*corp*/
/*Test si on connecté*/


if($_SESSION['id']){

    include('View/php/navbarConnected.php');
     
    $d = time();
    echo "<div class='row nomarginright'>";

    include('View/php/sidebarConnected.php');
    include('View/php/blockMyDocuments.php');
    echo"</div>";

    


    
}else{
       
    include('View/php/navbarNotConnected.php');
    //include('html/corpHorsLigne.php'); 
    echo "<div id='sidebar' class='col-sm-3 col-md-3 col-lg-2 col-xs-12'>";
    echo "</div>";
}

include('View/php/footer.php');
echo  "<script type='text/javascript' src='View/js/pageMyDocuments.js'></script>";
echo  "<script type='text/javascript' src='View/js/viewDocumentServices.js'></script>";
echo  "<script type='text/javascript' src='View/js/user.js'></script>";
echo  "<script type='text/javascript' src='View/js/document.js'></script>"; 
echo  "<script type='text/javascript' src='View/js/category.js'></script>"; 