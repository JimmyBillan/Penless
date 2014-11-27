<?php 
session_start();

/* Test si on connecté*/

if($_SESSION['id']){
    include('View/php/pageConnected.php');    
}else{        
    include('View/php/pageNotConnected.php');
}

