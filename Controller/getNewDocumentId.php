<?php

session_start();

require_once "Hashids.php";
    
// Test si on connecté
if($_SESSION['id']){
    // Crée un identifiant pour le nouveau document
    // et enregistre l'id du nouveau doc dans $_SESSION 
    $hashids = new Hashids("Penlesssaléesucréezd*zdzé*efefmù1e3f");
    
    $t1 = (int) (microtime(true) * 10000);
    $a1= $hashids->encode($t1);
    
   	$t1 = (int) (microtime(true) * 11111);
    $a2 = $hashids->encode($t1);
    
    $idDocument = $a1.$a2;
    $_SESSION['idDocument'] = $idDocument;
    echo $idDocument;
}
else {             
   echo "DISCONNECTED";
}