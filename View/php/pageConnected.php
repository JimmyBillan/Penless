<?php 
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
/* Header */
include('header.php');
    
/* Body */

include('navbarConnected.php');
echo "<div class='row nomarginright'>";
include('sidebarConnected.php');
		echo "<div id='corp'class='col-sm-9 col-md-10 col-xs-12'>";
		$root = realpath($_SERVER["DOCUMENT_ROOT"]);
		require_once $root."/Model/UserDB.php";


		echo "</div>";
echo"</div>";  

/* Footer */

include('footer.php');


echo  "<script type='text/javascript' src='View/js/Question.js'></script>";
echo  "<script type='text/javascript' src='View/js/Exercice.js'></script>";
echo  "<script type='text/javascript' src='View/js/get.js'></script>"; // CKE TODO à passer dans le footer?
echo "</html>";

