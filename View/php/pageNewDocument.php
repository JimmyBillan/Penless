<?php
session_start();

include('header.php');
require_once "../../Controller/Hashids.php";
    
/*corp*/
/*Test si on connecté*/

if($_SESSION['id']){
    include('navbarConnected.php');
    echo "<div class='row nomarginright'>";
    include('sidebarConnected.php');
    
    // Crée un identifiant pour le nouveau document 
    $hashids = new Hashids("Penlesssaléesucréezd*zdzé*efefmù1e3f");
    
    $t1 = (int) (microtime(true) * 10000);
    $a1= $hashids->encode($t1);
    
   	$t1 = (int) (microtime(true) * 11111);
    $a2 = $hashids->encode($t1);
    
    $_SESSION['idDocument'] = $a1.$a2;
    include('blockNewDocument.php');
    echo"</div>";
    
    
}
else {             
   include('navbarNotConnected.php'); // CKE et la suite?
}

include('footer.php');
echo  "<script type='text/javascript' src='View/js/pageNewDocument.js'></script>";