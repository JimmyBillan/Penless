<?php 
session_start ();

session_unset ();

session_destroy ();

//CKE vider $_SESSION??

header ('location: /index.php');
?>