<?php 
session_start();

/* Test si on connecté*/

if($_SESSION['id']){
    include('pageConnected.php');    
}else{        
    include('pageNotConnected.php');
}

